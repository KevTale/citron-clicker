# Citron Clicker

Un clone de Cookie Clicker, avec des citrons à la place des cookies.

Cliquez le gros citron, embauchez des mamies, plantez des vergers, puis partez coloniser des planètes acidulées. La partie se sauvegarde toute seule dans le navigateur.

## Jouer en ligne

**[https://quirky-beaver-428.harvis.page](https://quirky-beaver-428.harvis.page)**

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:43141](http://localhost:43141).

Pour republier le site statique :

```bash
npm run build
npx harvis deploy out
```

## Comment jouer

- Cliquez le citron pour gagner des citrons.
- Achetez des bâtiments à droite (ou via **Boutique** sur mobile). Ils produisent tout seuls.
- Les améliorations doublent une production, renforcent le clic, ou boostent tout le verger.
- Un **citron doré** apparaît de temps en temps : cliquez-le pour une frénésie, des clics ×777, ou un pactole.
- Les trophées se débloquent en jouant. Rien n’est obligatoire.

La sauvegarde est locale (`localStorage`). **Recommencer le verger** efface la partie.
