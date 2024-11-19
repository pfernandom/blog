# Use classes for validation and common operations
import activitypubdantic as ap
import json


# with open("./public/socialweb/outbox", "r") as f:

with open("./public/@blog", "r") as f:
    example_json = json.load(f)
    # # Example JSON from ActivityPub documentation
    # example_json = {
    #     "@context": ["https://www.w3.org/ns/activitystreams", {"@language": "en"}],
    #     "type": "Like",
    #     "actor": "https://dustycloud.org/chris/",
    #     "name": "Chris liked 'Minimal ActivityPub update client'",
    #     "object": "https://rhiaro.co.uk/2016/05/minimal-activitypub",
    #     "to": [
    #         "https://rhiaro.co.uk/#amy",
    #         "https://dustycloud.org/followers",
    #         "https://rhiaro.co.uk/followers/",
    #     ],
    #     "cc": "https://e14n.com/evan",
    # }

    # Get the appropriate class, which is determined by the type field
    output_class = ap.get_class(example_json)

    # Produce the parsed and validated JSON string
    output_json = output_class.json()
    print(output_json)  # See JSON below
