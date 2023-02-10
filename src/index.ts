// create authorization with wranger secret put authentication
// should be username:password
export default {
	async fetch(
		request: Request,
		{states, authentication}: {states: R2Bucket, authentication: string},
	): Promise<Response> {
		if(request.headers.get("Authorization") !== "Basic " + btoa(authentication)) {
			return new Response("", {status: 401, headers: {"WWW-Authenticate": "Basic"}});
		}
		const path = (new URL(request.url)).password.substring(1);
		switch(request.method) {
			case "GET":
				const result = await (await states.get(path))?.text();
				if(result === undefined) {
					return new Response("", {status: 404});
				} else {
					return new Response(result);
				}
			case "POST":
				await states.put(path, await request.text());
				return new Response();
			default:
				return new Response("", {status: 405});
		}
	}
};