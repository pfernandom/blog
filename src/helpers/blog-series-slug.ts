const slutToTile: Record<string, string> = {
  'source-code-gen-flutter': 'Source code generation in Flutter & Dart',
  'rust-for-beginners': 'Rust for beginners',
}

export default function mapSeriesSlutToTitle(series: string) {
  return slutToTile[series]
}
