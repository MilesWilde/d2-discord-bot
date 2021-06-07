import { HexItemColor } from "models/item_models";
import fs from "fs";
import { Image, registerFont, createCanvas, Canvas } from "canvas";

registerFont("./fonts/diablo_h.ttf", { family: "Diablo II" });

export function createImage(
    imageDescriptionList: ImageDescription[],
    thumbnailInputPath: string,
    outputPath: string
) {
    return createImageCanvasBuffer(
        imageDescriptionList,
        thumbnailInputPath
    ).then((buffer) => {
        return writeImage(buffer, outputPath);
    });
}

export function writeImage(
    imageBuffer: Buffer,
    outputPath: string
): Promise<boolean> {
    return new Promise((resolve) => {
        try {
            fs.writeFileSync(outputPath, imageBuffer);
            resolve(true);
        } catch (err) {
            resolve(false);
        }
    });
}

export function createImageCanvasBuffer(
    imageDescriptionList: ImageDescription[],
    thumbnailInputPath: string
): Promise<Buffer> {
    var canvasWidth = 550;
    var canvasHeight = 300;
    var canvasMiddle = canvasWidth / 2;
    var currentCanvasY = 0;
    var canvasFontSize = 18;
    var canvasHeightIncrement = canvasFontSize;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext("2d");
    context.font = `${canvasFontSize}px "Diablo II"`;
    context.textAlign = "center";
    imageDescriptionList.forEach((imageDescription) => {
        context.fillStyle = `${imageDescription.colour}`;
        context.fillText(
            imageDescription.text,
            canvasMiddle,
            (currentCanvasY += canvasHeightIncrement)
        );
    });

    return new Promise((resolve, reject) => {
        fs.readFile(thumbnailInputPath, function (err, imageData) {
            if (err) {
                reject(err);
            }
            var canvasImage = new Image();

            canvasImage.src = imageData;

            context.drawImage(
                canvasImage,
                canvasMiddle - canvasImage.width / 2,
                (currentCanvasY += canvasHeightIncrement),
                canvasImage.width,
                canvasImage.height
            );

            resolve(canvas.toBuffer());
        });
    });
}

export interface ImageDescription {
    text: string;
    colour: HexItemColor;
}
