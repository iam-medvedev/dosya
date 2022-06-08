import { createBytes } from "./utils.ts";

// https://en.wikipedia.org/wiki/Zip_(file_format)#File_headers
function createZipHeader(type: string, mime?: string) {
  const zip = [0x50, 0x4b, 0x3, 0x4];

  if (mime) {
    return [
      ...zip,
      ...createBytes({ value: mime.length, offset: 14 }), // 18 byte — size of mime
      ...createBytes({ value: mime.length, offset: 3 }), // 20 byte — size of mime
      ...createBytes({ value: type.length, offset: 3 }), // File name length — 26 byte
      ...createBytes({ value: type, offset: 3 }), // File name — 30 byte
      ...createBytes(mime), // mime type
    ];
  }

  return [
    ...zip,
    ...createBytes({ value: type.length, offset: 26 - zip.length }), // File name length — 26 byte
    ...createBytes({ value: type, offset: 3 }), // File name — 30 byte
  ];
}

function createOggContainer(bytes: number[] = []) {
  return [
    ...createBytes("OggS"),
    ...createBytes({ length: 24 }), // fill empty bytes
    ...createBytes({ value: bytes, length: 8 }), // fill 8 bytes
  ];
}

// https://en.wikipedia.org/wiki/ISO_base_media_file_format
function createFtyp(format = "") {
  return [
    ...createBytes({ value: "ftyp", offset: 4 }),
    ...createBytes({ value: format, length: 4, fillSymbol: " ".charCodeAt(0) }), // fill 4 bytes (with spaces, if format's length is less than 4 bytes)
  ];
}

function createRiff(bytes: number[]) {
  return [0x52, 0x49, 0x46, 0x46, ...createBytes({ value: bytes, offset: 4 })];
}

function createPng(format: string) {
  return [
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a,
    ...createBytes({ value: format, offset: 4 }),
  ];
}

function createJpeg2000(format: string) {
  return [
    0x0,
    0x0,
    0x0,
    0x0c,
    0x6a,
    0x50,
    0x20,
    0x20,
    0x0d,
    0x0a,
    0x87,
    0x0a,
    ...createBytes({
      value: format,
      fillSymbol: " ".charCodeAt(0),
      length: 4,
      offset: 8,
    }),
  ];
}

/**
 * Bytes records for some extensions
 */
export const extensions = {
  "3g2": createFtyp("3g2"),
  "3gp": createFtyp("3gp"),
  "3mf": createZipHeader("3D/.model"),
  "7z": [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c],
  ac3: [0x0b, 0x77],
  ai: [
    ...createBytes("%PDF"),
    ...createBytes({ value: "AIPrivateData", offset: 1350 }),
  ],
  aif: createBytes("FORM"),
  alias: [
    0x62, 0x6f, 0x6f, 0x6b, 0x0, 0x0, 0x0, 0x0, 0x6d, 0x61, 0x72, 0x6b, 0x0,
    0x0, 0x0, 0x0,
  ],
  amr: createBytes("#!AMR"),
  ape: createBytes("MAC "),
  apng: createPng("acTL"),
  ar: createBytes({ value: "!<arch>", length: 21 }),
  arrow: [0x41, 0x52, 0x52, 0x4f, 0x57, 0x31, 0x0, 0x0],
  asf: [0x30, 0x26, 0xb2, 0x75, 0x8e, 0x66, 0xcf, 0x11, 0xa6, 0xd9],
  avi: createRiff([0x41, 0x56, 0x49]),
  avif: createFtyp("avif"),
  blend: createBytes("BLENDER"),
  bmp: [0x42, 0x4d],
  bpg: [0x42, 0x50, 0x47, 0xfb],
  bz2: [0x42, 0x5a, 0x68],
  cab: createBytes("MSCF"),
  cfb: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
  chm: createBytes("ITSF"),
  cr2: [0x49, 0x49, 0x2a, 0x0, 0x6, ...createBytes({ value: "CR", offset: 3 })],
  cr3: createFtyp("crx"),
  crx: createBytes("Cr24"),
  cur: [0x0, 0x0, 0x02, 0x0],
  dcm: createBytes({ value: [0x44, 0x49, 0x43, 0x4d], offset: 128 }),
  deb: [
    ...createBytes("!<arch>"),
    ...createBytes({ value: "debian-binary", offset: 1 }),
  ],
  dmg: [0x78, 0x01],
  docx: createZipHeader("word/.xml"),
  dsf: createBytes("DSD "),
  elf: [0x7f, 0x45, 0x4c, 0x46],
  eot: [
    ...createBytes({ value: [0x0, 0x0, 0x01], offset: 8 }),
    ...createBytes({ value: [0x4c, 0x50], offset: 34 - 8 - 3 }),
  ],
  eps: [
    0x25,
    0x21,
    ...createBytes("PS-Adobe-"),
    ...createBytes({ value: " EPSF-", offset: 3 }),
  ],
  epub: createZipHeader("mimetype", "application/epub+zip"),
  exe: [0x4d, 0x5a],
  f4a: createFtyp("F4A"),
  f4b: createFtyp("F4B"),
  f4p: createFtyp("F4P"),
  f4v: createFtyp("F4V"),
  flac: createBytes("fLaC"),
  flif: createBytes("FLIF"),
  flv: [0x46, 0x4c, 0x56, 0x01],
  gif: [0x47, 0x49, 0x46],
  glb: [0x67, 0x6c, 0x54, 0x46, 0x02, 0x0, 0x0, 0x0],
  gz: [0x1f, 0x8b, 0x8],
  heic: createFtyp("mif1"),
  icns: createBytes("icns"),
  ico: [0x0, 0x0, 0x01, 0x0],
  ics: createBytes("BEGIN:VCALENDAR"),
  indd: [
    0x06, 0x06, 0xed, 0xf5, 0xd8, 0x1d, 0x46, 0xe5, 0xbd, 0x31, 0xef, 0xe7,
    0xfe, 0x74, 0xb7, 0x1d,
  ],
  it: createBytes("IMPM"),
  jp2: createJpeg2000("jp2"),
  jpg: [0xff, 0xd8, 0xff],
  jpx: createJpeg2000("jpx"),
  jxl: [0xff, 0x0a],
  jxr: [0x49, 0x49, 0xbc],
  ktx: [0xab, 0x4b, 0x54, 0x58, 0x20, 0x31, 0x31, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a],
  lnk: [
    0x4c, 0x0, 0x0, 0x0, 0x01, 0x14, 0x02, 0x0, 0x0, 0x0, 0x0, 0x0, 0xc0, 0x0,
    0x0, 0x0, 0x0, 0x0, 0x0, 0x46,
  ],
  lz: createBytes("LZIP"),
  lzh: createBytes({ value: "-lh0-", offset: 2 }),
  m4a: createFtyp("M4A"),
  m4b: createFtyp("M4B"),
  m4p: createFtyp("M4P"),
  m4v: createFtyp("M4V"),
  mid: createBytes("MThd"),
  mie: [0x7e, 0x18, 0x04, 0x0, 0x30, 0x4d, 0x49, 0x45],
  mj2: createJpeg2000("mjp2"),
  mobi: createBytes({
    value: [0x42, 0x4f, 0x4f, 0x4b, 0x4d, 0x4f, 0x42, 0x49],
    offset: 60,
  }),
  mov: createFtyp("qt"),
  mp3: [...createBytes("ID3"), ...createBytes({ value: "#TSSE", offset: 5 })],
  mp4: createFtyp(),
  mpc: createBytes("MP+"),
  mpg: [0x0, 0x0, 0x01, 0xba, 0x21],
  mts: [0x47, ...createBytes({ value: [0x47], offset: 187 })],
  mxf: [
    0x06, 0x0e, 0x2b, 0x34, 0x02, 0x05, 0x01, 0x01, 0x0d, 0x01, 0x02, 0x01,
    0x01, 0x02,
  ],
  nef: [0x49, 0x49, 0x2a, 0x0, 0x8, 0x0, 0x0, 0x0, 0x1c, 0x0, 0xfe, 0x0],
  nes: [0x4e, 0x45, 0x53, 0x1a],
  odp: createZipHeader(
    "mimetype",
    "application/vnd.oasis.opendocument.presentation"
  ),
  ods: createZipHeader(
    "mimetype",
    "application/vnd.oasis.opendocument.spreadsheet"
  ),
  odt: createZipHeader("mimetype", "application/vnd.oasis.opendocument.text"),
  oga: createOggContainer([0x7f, 0x46, 0x4c, 0x41, 0x43]),
  ogg: createOggContainer([0x01, 0x76, 0x6f, 0x72, 0x62, 0x69, 0x73]),
  ogm: createOggContainer([0x01, 0x76, 0x69, 0x64, 0x65, 0x6f]),
  ogv: createOggContainer([0x80, 0x74, 0x68, 0x65, 0x6f, 0x72, 0x61]),
  ogx: createOggContainer(),
  opus: createOggContainer([0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64]),
  orf: [0x49, 0x49, 0x52, 0x4f, 0x08, 0x0, 0x0, 0x0, 0x18],
  otf: [0x4f, 0x54, 0x54, 0x4f, 0x0],
  pcap: [0xd4, 0xc3, 0xb2, 0xa1],
  pdf: createBytes("%PDF"),
  pgp: createBytes("-----BEGIN PGP MESSAGE-----"),
  png: createPng("IDAT"),
  pptx: createZipHeader("ppt/.xml"),
  ps: [0x25, 0x21],
  psd: createBytes("8BPS"),
  qcp: createRiff([0x51, 0x4c, 0x43, 0x4d]),
  raf: createBytes("FUJIFILMCCD-RAW"),
  rar: [0x52, 0x61, 0x72, 0x21, 0x1a, 0x7, 0x0],
  rpm: [0xed, 0xab, 0xee, 0xdb],
  rtf: createBytes("{\\rtf"),
  rw2: [0x49, 0x49, 0x55, 0x0, 0x18, 0x0, 0x0, 0x0, 0x88, 0xe7, 0x74, 0xd8],
  s3m: createBytes({ value: "SCRM", offset: 44 }),
  shp: [0x0, 0x0, 0x27, 0x0a, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
  skp: [
    0xff, 0xfe, 0xff, 0x0e, 0x53, 0x0, 0x6b, 0x0, 0x65, 0x0, 0x74, 0x0, 0x63,
    0x0, 0x68, 0x0, 0x55, 0x0, 0x70, 0x0, 0x20, 0x0, 0x4d, 0x0, 0x6f, 0x0, 0x64,
    0x0, 0x65, 0x0, 0x6c, 0x0,
  ],
  spx: createOggContainer([0x53, 0x70, 0x65, 0x65, 0x78, 0x20, 0x20]),
  sqlite: createBytes("SQLi"),
  stl: createBytes("solid "),
  swf: [0x43, 0x57, 0x53],
  tar: [
    ...createBytes("x"),
    ...createBytes({ value: "000644", offset: 99 }),
    ...createBytes({ value: "000765", offset: 2 }),
    ...createBytes({ value: "000024", offset: 2 }),
    ...createBytes({ value: "          0", offset: 2 }),
    ...createBytes({ value: "14247674331", offset: 1 }),
    ...createBytes({ value: " 10060", offset: 1 }),
    ...createBytes({ value: " 0", offset: 1 }),
    ...createBytes({ value: "ustar", offset: 100 }),
    ...createBytes({ value: "00u", offset: 1 }),
    ...createBytes({ value: "staff", offset: 31 }),
    ...createBytes({ value: "000000", offset: 27 }),
    ...createBytes({ value: "000000", offset: 2 }),
  ],
  tif: [0x49, 0x49, 0x2b],
  ttf: [0x0, 0x01, 0x0, 0x0, 0x0],
  vcf: createBytes("BEGIN:VCARD"),
  voc: createBytes("Creative Voice File"),
  wasm: [0x0, 0x61, 0x73, 0x6d],
  wav: createRiff([0x57, 0x41, 0x56, 0x45]),
  webp: createBytes({ value: "WEBP", offset: 8 }),
  woff: [...createBytes("wOFF"), 0x0, 0x01, 0x0, 0x0],
  woff2: [...createBytes("wOF2"), 0x0, 0x01, 0x0, 0x0],
  wv: createBytes("wvpk"),
  xcf: createBytes("gimp xcf "),
  xlsx: createZipHeader("xl/.xml"),
  xm: createBytes("Extended Module:"),
  xml: createBytes("<?xml "),
  xpi: createZipHeader("META-INF/mozilla.rsa"),
  xz: [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x0],
  Z: [0x1f, 0xa0],
  zip: [0x50, 0x4b, 0x3, 0x4],
  zst: [0x28, 0xb5, 0x2f, 0xfd],
  // TODO: aac
  // TODO: webm, mkv https://github.com/sindresorhus/file-type/blob/main/core.js#L649
};

export type Extensions = keyof typeof extensions;
export const extKeys = Object.keys(extensions) as Extensions[];
