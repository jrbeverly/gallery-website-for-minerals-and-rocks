// Specimen entries live in specimens.js; this file is the building itself.

window.GROVE = {
  museum: {
    name: "Minerals",
    tagline: "A private museum of stones",
    established: "Established MMXXVI · Admission always free",
    lobbyCaption:
      "Four rooms, one visitor at a time. Choose a doorway and take your time.",
  },

  wingOrder: ["minerals", "igneous", "fossils", "meteorites"],

  wings: {
    minerals: {
      key: "minerals",
      numeral: "I",
      title: "Hall of Minerals",
      short: "Minerals",
      mood: "light",
      lobbyNote: "Crystals of the deep earth",
      caption:
        "A glass case, quietly lit. The amethyst has the top shelf, and knows it.",
      intro: [
        "Minerals are the alphabet of the earth: each species a fixed arrangement of elements, repeated a trillion times until it becomes something you can hold. Where a crystal grew unhurried and uncrowded, its geometry survives intact.",
        "The pieces in this case were chosen for colour and habit — the outward shape a mineral takes when nothing interrupts it. Lean close. The surfaces reward it.",
      ],
    },

    igneous: {
      key: "igneous",
      numeral: "II",
      title: "Igneous Gallery",
      short: "Igneous Rocks",
      mood: "light",
      lobbyNote: "Born of fire, written in texture",
      caption:
        "Everything on these shelves was once liquid. Nothing here has melted in quite a while.",
      intro: [
        "Every rock in this case began as melt — magma held under the crust, or lava loosed on top of it. What each one became depended almost entirely on how quickly it was asked to cool.",
        "Cool a melt over a million years and its crystals grow coarse enough to read; quench it in a day and it becomes glass. Texture is the record of patience. Read these samples like weather reports from the deep past.",
      ],
    },

    fossils: {
      key: "fossils",
      numeral: "III",
      title: "Fossil Wing",
      short: "Fossils",
      mood: "light",
      lobbyNote: "Life, pressed and kept",
      caption:
        "It is very quiet in this room. Most of the residents have been asleep for three hundred million years.",
      intro: [
        "Almost nothing that lives is remembered in stone. Burial must be quick, the water still, the chemistry kind — and then a hundred million years must pass without incident. Each object in this case is a survivor of those odds.",
        "These are not pictures of ancient life; they are its paperwork — shell by shell, frond by frond, filed in sediment and pressed until permanent. A small postponement of disappearance.",
      ],
    },

    meteorites: {
      key: "meteorites",
      numeral: "IV",
      title: "Meteorite Vault",
      short: "Meteorites",
      mood: "dark",
      lobbyNote: "Visitors from the early solar system",
      caption: "The vault is kept dim. Iron this old prefers it.",
      intro: [
        "Everything else in the Grove formed beneath your feet. Nothing in this room did. These are pieces of broken worlds — planetesimals that assembled in the first few million years of the solar system, shattered, and wandered until they fell here.",
        "Most are older than any rock the Earth has managed to keep. Handle the thought, if not the iron: the vault's residents predate the ground it is built on.",
      ],
    },
  },

  colophon: {
    title: "Colophon",
    body: [
      "Minerals is a private museum of stones, kept small on purpose. There is no shop, no soundtrack, and no tracking — only rooms, cases, and labels.",
      "The photographs presently on display are borrowed placeholders: the work of specimen photographers who share their images freely on Wikimedia Commons. They are credited below with gratitude, and will step aside as the Grove's own specimens are photographed.",
      "The building is plain HTML, CSS, and JavaScript, typeset in the visitor's own serif. Motion is slow by design; the collection is patient and sees no reason you shouldn't be.",
    ],
  },
};
