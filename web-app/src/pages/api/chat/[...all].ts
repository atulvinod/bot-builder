import { getChatServiceHost } from "@/app/shared/utils";
import { createProxyMiddleware } from "http-proxy-middleware";

const proxy = createProxyMiddleware({
    target: getChatServiceHost(),
    secure: false,
    pathRewrite: { "^/api/chat": "" },
});

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false,
    },
};

export default function handler(req: any, res: any) {
    proxy(req, res, (err: any) => {
        if (err) {
            throw err;
        }

        throw new Error(
            `Request '${req.url}' is not proxied! We should never reach here!`
        );
    });
}
