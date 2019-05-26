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
const child_process_1 = require("child_process");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
(() => __awaiter(this, void 0, void 0, function* () {
    const app = express_1.default();
    const port = 8082; // default port to listen
    app.use(body_parser_1.default.json());
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    function downloadURLtoFile(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const filename = '/tmp/' + Math.floor(Math.random() * 2000) + '.jpg';
            const absolute = path_1.default.join(__dirname, filename);
            const file = yield fs_1.default.createWriteStream(absolute, { flags: 'w' });
            const request = yield https_1.default.get(url, function (response) {
                response.pipe(file);
            });
            return filename;
        });
    }
    function filterLocalImage(inputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputPath_builder = inputPath.split('.');
            outputPath_builder.splice(1, 0, 'filtered');
            const outputPath = outputPath_builder.join('.');
            const pythonProcess = child_process_1.spawn('python3', ["src/image_filter.py", "/" + inputPath, "/" + outputPath]);
            let python;
            if (pythonProcess !== undefined) {
                yield pythonProcess.stdout.on('data', (data) => {
                    console.log(data.toString());
                });
                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    yield pythonProcess.stdout.on('end', () => {
                        return resolve(outputPath);
                    });
                }));
            }
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
        const filepath = yield downloadURLtoFile(image_url);
        const filteredpath = yield filterLocalImage(filepath);
        yield res.sendFile(__dirname + '/' + filteredpath);
        res.on('finish', () => {
            deleteLocalFiles([filepath, filteredpath]);
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