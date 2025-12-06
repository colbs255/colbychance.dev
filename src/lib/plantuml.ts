import { spawn } from "child_process";
import crypto from "crypto";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
import type { DiagramPath } from "./types";

const CACHE_DIR = path.resolve("./public/diagrams");

// Make sure the cache dir exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function hashUmlCode(source: string) {
    return crypto.createHash("sha256").update(source).digest("hex");
}

export default async function generatePlantUmlSvg(
    source: string,
): Promise<DiagramPath> {
    const hash = hashUmlCode(source);
    // Write temp input file
    await fsPromise.mkdir(path.join(CACHE_DIR, hash), { recursive: true });
    const inputFile = path.join(CACHE_DIR, hash, "diagram.uml");
    await fsPromise.writeFile(inputFile, source);

    const generate = async (theme: string, name: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Plantuml creates diagrams in same directory as input file
            // Specifying an '-o' will cause it to create the file in a subfolder
            const child = spawn("plantuml", [
                "-Playout=smetana",
                "-tsvg",
                inputFile,
                "-theme",
                theme,
                // Themes have different values for the following so we force the same value
                "-Sshadowing=false",
                "-SPadding=5",
                "-o",
                name,
            ]);

            child.on("error", (err) => {
                reject(new Error(`Failed to run PlantUML: ${err.message}`));
            });

            child.on("close", (code) => {
                if (code !== 0) {
                    reject(new Error(`PlantUML failed with code ${code}`));
                } else {
                    resolve();
                }
            });
        });
    };

    await Promise.all([
        generate("cyborg", "dark"),
        generate("materia", "light"),
    ]);
    return {
        hash,
        dark: `/diagrams/${hash}/dark/diagram.svg`,
        light: `/diagrams/${hash}/light/diagram.svg`,
    };
}
