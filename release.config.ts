import fs from 'fs';
import type { GlobalConfig } from 'semantic-release';

const RELEASE_FILE = 'RELEASE.md';

// Minimal shapes used from runtime context to avoid tight coupling to internal types
type LoggerLike = { log: (...args: any[]) => void };
type SRContext = { logger?: LoggerLike; nextRelease?: { version?: string } };

// Read a file safely
function readFileSafe(file: string): string {
    try {
        return fs.readFileSync(file, 'utf8');
    } catch {
        return '';
    }
}

// Extract the "Unreleased" section (robust to newlines/casing)
function getUnreleased(content: string): string {
    const match = content.match(/#\s*Unreleased\s*[\r\n]+([\s\S]*?)(?:\n#|\r\n#|$)/i);
    return match?.[1]?.trim() ?? '';
}

// Non-empty check for any meaningful line
function hasAnyMeaningfulLine(block: string): boolean {
    return (
        block
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter((l) => l.length > 0).length > 0
    );
}

// Rotate RELEASE.md: move Unreleased into a versioned section and recreate Unreleased header
function rotateReleaseMd(version: string, dateISO: string, logger?: LoggerLike) {
    const content = readFileSafe(RELEASE_FILE);
    const unreleased = getUnreleased(content);
    if (!unreleased) {
        logger?.log('No Unreleased entries to rotate; skipping RELEASE.md update');
        return;
    }

    const header = `# Unreleased\n\n`;
    const versionHeader = `# ${version} – ${dateISO}\n\n`;

    // Remove current Unreleased contents, keeping a clean Unreleased header
    const afterUnreleased = content.replace(
        /#\s*Unreleased\s*[\r\n]+([\s\S]*?)(?:\n#|\r\n#|$)/i,
        `${header}`,
    );

    // Insert the new version block immediately after the Unreleased header
    const rebuilt = afterUnreleased.replace(
        header,
        `${header}${versionHeader}${unreleased.trim()}\n\n`,
    );

    fs.writeFileSync(RELEASE_FILE, rebuilt, 'utf8');
}

// Analyze release solely from RELEASE.md (no Conventional Commits required)
async function analyzeFromReleaseMd(_cfg: unknown, context: SRContext) {
    const logger = context.logger;
    const content = readFileSafe(RELEASE_FILE);
    if (!content) {
        logger?.log('RELEASE.md not found or empty; skipping release');
        return null;
    }
    const unreleased = getUnreleased(content);
    logger?.log(`Parsed Unreleased block length: ${unreleased.length}`);
    if (!hasAnyMeaningfulLine(unreleased)) {
        logger?.log('Unreleased section empty; skipping release');
        return null;
    }
    const lower = unreleased.toLowerCase();
    if (lower.includes('breaking')) {
        logger?.log('Detected BREAKING in Unreleased -> major release');
        return 'major';
    }
    if (lower.includes('feat')) {
        logger?.log('Detected feat in Unreleased -> minor release');
        return 'minor';
    }
    logger?.log('Unreleased has entries but no feat/breaking -> patch release');
    return 'patch';
}

// Prepare hook to rotate RELEASE.md before committing
async function prepareRotate(_cfg: unknown, context: SRContext) {
    const logger = context.logger;
    const version = context?.nextRelease?.version;
    if (!version) {
        logger?.log('No nextRelease.version available in prepare; skipping rotation');
        return;
    }
    const today = new Date().toISOString().slice(0, 10);
    rotateReleaseMd(`v${version}`, today, logger);
}

const config: GlobalConfig = {
    branches: ['main'],
    repositoryUrl: 'https://github.com/navadhiti/bna-service',
    tagFormat: 'v${version}',

    plugins: [
        // Inline plugin object that provides only the hooks we need
        { analyzeCommits: analyzeFromReleaseMd, prepare: prepareRotate } as any,

        // Generate release notes and prepend Unreleased entries
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
                writerOpts: {
                    transform: (commit: any) => commit,
                    finalizeContext: (context: any) => {
                        const unreleased = getUnreleased(readFileSafe(RELEASE_FILE));
                        if (unreleased) {
                            context.notes = (unreleased + '\n\n' + (context.notes || '')).trim();
                        }
                        return context;
                    },
                },
            },
        ],

        // Commit updated RELEASE.md (and CHANGELOG.md if used) back to repo
        [
            '@semantic-release/git',
            {
                assets: ['package.json', 'CHANGELOG.md', 'RELEASE.md'],
                message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],

        // Create GitHub Release and upload dist assets
        [
            '@semantic-release/github',
            {
                assets: [{ path: 'dist/**', label: 'dist folder' }],
            },
        ],
    ],
};

export default config;






const i = 100;
