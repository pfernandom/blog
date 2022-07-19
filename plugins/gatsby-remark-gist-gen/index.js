const { Octokit } = require('octokit');
var visit = require("unist-util-visit")

let allFiles = {};

var id = Symbol("id");

const GLOBAL_DESCRIPTION = "I created this gist using Octokit!";


async function createGist(files) {
    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
    const octokit = new Octokit({ auth: process.env.GITHUB_KEY });

    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    const {
        data: { login },
    } = await octokit.rest.users.getAuthenticated();

    //

    if (Object.keys(allFiles).length == 0) {

        const { data } = await octokit.rest.gists.list()

        data.forEach(({ files, html_url }) => {
            //console.log({ html_url, files });
            Object.keys(files).forEach(f => {
                allFiles[f] = `${html_url}?file=${f}`;
            });
        })
    }

    const filtered = {}

    Object.entries(files).forEach(([key, val]) => {
        if (!allFiles[key]) {
            filtered[key] = val;
        }
    });

    if (Object.keys(filtered).length > 0) {
        const r = await octokit.rest.gists.create({
            description: GLOBAL_DESCRIPTION,
            public: true,
            files: filtered
        });

        const { files, html_url } = r.data;

        const result = {}

        Object.keys(files).forEach(f => {
            result[f] = `${html_url}?file=${f}`;
        });

        return result;

    }

    return allFiles;
}

const LANG_TO_EXT = {
    'dart': 'dart',
    "javascript": 'js',
    'js': 'js',
    'css': 'css',
    'java': 'java',
    null: 'js'
}

module.exports = async (args, pluginOptions) => {
    // Manipulate AST
    const { markdownAST, files, markdownNode, actions, cache, reporter } = args;
    try {
        let i = 0;
        const slugName = markdownNode.fields.slug.replaceAll('/', '-');
        const getFileName = (lang) => {
            return `blog-gist${slugName}${i++}.${LANG_TO_EXT[lang]}`
        }
        const fileList = {}

        visit(markdownAST, "code", (node) => {
            const fileName = getFileName(node.lang);

            node[id] = fileName;

            fileList[fileName] = {
                content: node.value
            };
        });

        visit(markdownAST, "gist", (node) => {
            print({ gist: node })
        })

        const gistResults = await createGist(fileList)

        visit(markdownAST, "code", (node) => {
            const fileName = node[id];

            if (gistResults[fileName]) {
                // console.log({ node, fileName: gistResults[fileName] })
                node.type = 'inlineCode';
                node.children = undefined;
                node.value = `gist:${gistResults[fileName].replace('https://gist.github.com/', '')}`
            }
        });
    } catch (e) {
        console.error(e);
    }
    reporter.success("gatsby-remark-gist-gen succeeded");
    return markdownAST
}


async function deleteAllGists() {
    const { data } = await octokit.rest.gists.list()

    const allPromises = []

    data.forEach(async d => {
        const { id, description } = d;

        if (GLOBAL_DESCRIPTION.includes(description)) {
            console.log({
                gist_id: id
            });
            allPromises.push(octokit.rest.gists.delete({
                gist_id: id
            }).catch((err) => { }))
        }
        //console.log(d)
    })

    return allPromises;
}