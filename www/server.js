"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Jimp = require("jimp");
(() => __awaiter(this, void 0, void 0, function* () {
    const app = express_1.default();
    const port = process.env.PORT || 8082; // default port to listen
    app.use(body_parser_1.default.json());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    function filterImageFromURL(inputURL) {
        return __awaiter(this, void 0, void 0, function* () {
            // open a file called "lenna.png"
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const photo = yield Jimp.read(inputURL);
                const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
                yield photo
                    .resize(256, 256) // resize
                    .quality(60) // set JPEG quality
                    .greyscale() // set greyscale
                    .write(__dirname + outpath, (img) => {
                    resolve(outpath);
                });
            }));
        });
    }
    function deleteLocalFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let file of files) {
                fs_1.default.unlinkSync(path_1.default.join(__dirname, file));
            }
        });
    }
    // Root URI call
    app.get("/processedimage", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { image_url } = req.query;
        if (!image_url) { // this  regex that they are urls
            return res.status(422).send(`image_url is required`);
        }
        // const filepath = await downloadURLtoFile(image_url);
        const filteredpath = yield filterImageFromURL(image_url);
        yield res.sendFile(__dirname + filteredpath);
        res.on('finish', () => {
            deleteLocalFiles([filteredpath]);
        });
    }));
    // Root URI call
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send("try the correct endpoint");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map