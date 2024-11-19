const slutToTile: Record<string, string> = {
  'source-code-gen-flutter': 'Source code generation in Flutter & Dart',
  'rust-for-beginners': 'Rust for beginners',
  'running-go-in-nodejs': 'Executing WebAssmebly modules inside NodeJS (2022)',
  'neovim-fun': 'Having fun with Neovim',
  dev_environments: 'The cost of poor software development environments',
}

export default function mapSeriesSlutToTitle(series: string) {
  return slutToTile[series]
}
