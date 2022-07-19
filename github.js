const { Octokit } = require('octokit');


async function main() {
    console.log(Octokit);
    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
    const octokit = new Octokit({ auth: `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` });

    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    const {
        data: { login },
    } = await octokit.rest.users.getAuthenticated();


    console.log("Hello, %s", login);

    const result = await octokit.rest.gists.create({
        description: "I created this gist using Octokit!",
        public: true,
        files: {
            "example.js": {
                content: `/* some code here */`
            },
        },
    });

    console.log(result);
}

main();