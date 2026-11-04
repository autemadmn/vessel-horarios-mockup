// Genera los avatares de demostración de VESSEL (DiceBear Lorelei, CC0) como SVG locales.
import { Avatar, Style } from '@dicebear/core';
import fs from 'node:fs';
// Uso: npm i @dicebear/core@10 @dicebear/styles@10 && node tools/generate-avatars.mjs assets/avatars
const out = process.argv[2] || 'assets/avatars';
fs.mkdirSync(out, { recursive: true });
const def = JSON.parse(fs.readFileSync('node_modules/@dicebear/styles/dist/lorelei.min.json', 'utf8'));
const style = new Style(def);
// Identificador estable -> semilla y peinado. La semilla no contiene datos personales.
const people = {
  angel: ['vessel-angel', 'variant04'],
  miriam: ['vessel-miriam', 'variant23'],
  filipa: ['vessel-filipa', 'variant24'],
  samir: ['vessel-samir', 'variant05'],
  alejandro: ['vessel-alejandro', 'variant08'],
  sergio: ['vessel-sergio', 'variant20'],
  lucia: ['vessel-lucia', 'variant15'],
  elena: ['vessel-elena', 'variant32'],
  david: ['vessel-david', 'variant39'],
  nora: ['vessel-nora', 'variant14'],
  pablo: ['vessel-pablo', 'variant02'],
  ines: ['vessel-ines', 'variant29'],
};
const pool = ['variant01','variant13','variant03','variant16','variant06','variant19','variant07','variant21','variant09','variant40','variant12','variant46'];
pool.forEach((h, i) => (people[`pool-${String(i + 1).padStart(2, '0')}`] = [`vessel-pool-${i + 1}`, h]));
for (const [id, [seed, hair, extra = {}]] of Object.entries(people)) {
  const svg = new Avatar(style, { seed, hairVariant: hair, beardProbability: 0, earringsProbability: 0, frecklesProbability: 0, ...extra }).toString();
  fs.writeFileSync(`${out}/${id}.svg`, svg);
}
console.log(Object.keys(people).length, 'avatares');
