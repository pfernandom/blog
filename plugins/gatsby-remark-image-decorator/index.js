var visit = require("unist-util-visit")

module.exports = async (args, pluginOptions) => {
    // Manipulate AST
    //console.log({ args })
    const { markdownAST, files, markdownNode, ...rest } = args;
    visit(markdownAST, "image", (node) => {
        console.log({ node: JSON.stringify(node) })
    });
    return markdownAST
}

