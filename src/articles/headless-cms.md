---
title: Les CMS Headless
subtitle: J'ai perdu la tête, depuis que j'ai vu Suzette
description: Les CMS Headless ont le vent en poupe ces derniers temps. Nous allons voir ensemble les solutions existantes sur un modèle "Open Source".
date: 2022-01-02
cover: headless-cms/headless-cms.jpg
tags:
  - strapi
  - headless
  - directus
  - cms
---

## C'est quoi un Headless CMS ?

Un CMS est l'acronyme de **Content Management System** qui se traduit par **système de gestion de contenus**.

Je ne vais pas rentrer dans les détails de ce qu'est un CMS, beaucoup d'articles traitent de ce sujet.

Il faut juste saisir une notion importante concernant les systèmes de gestion de contenus.

Nous avons deux grandes catégories de CMS :

- Les **"CMS complet"** comprenant une interface d'administration (backend ou arrière boutique en français) et le site visible par les internautes (frontend) dont les plus connus sont Wordpress, Joomla, Drupal...
- Les CMS incluant uniquement une interface d'administration qu'on nomme les **"Headless CMS"**. "Headless" veut dire sans tête. Dans l'univers du CMS, la tête représente la partie visible de votre site (frontend ou l'avant de votre boutique).

Cette différence est essentielle à comprendre pour de multiples raisons :

1. Les "Headless CMS" **sont généralement moins accessibles pour les personnes qui n'ont pas un bagage technique**. Ce point est à mon sens l'un des plus importants sur l'adhésion de ce type de technologie pour le grand public. Je reviendrai sur ce sujet un peu plus loin dans cet article.
2. Les **"Headless CMS" découple la façon de consommer vos données**. Elles sont distribuées en passant par des API, vous pouvez donc les afficher sur un site Web, une application mobile, un objet connecté... Cette approche répond à une problématique de ces dernières années avec l'apparition des smartphones et des objets connectés.
3. 