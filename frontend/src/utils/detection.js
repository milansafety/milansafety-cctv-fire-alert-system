// src/utils/detection.js
// Isme wahi code paste karein jo pichle jawab me diya gaya tha.
export function detectRedColor(ctx, canvas, video) {
    const cv = window.cv;
    if (!cv) return false;
    try {
        const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        const hsv = new cv.Mat();
        const mask = new cv.Mat();
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        src.data.set(imageData.data);
        cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
        cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);
        let low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 120, 70, 0]);
        let high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [10, 255, 255, 255]);
        cv.inRange(hsv, low, high, mask);
        let nonZero = cv.countNonZero(mask);
        let percentage = (nonZero / (canvas.width * canvas.height)) * 100;
        src.delete(); hsv.delete(); mask.delete(); low.delete(); high.delete();
        if (percentage > 1) {
            console.log("Red color detected!", percentage);
            return true;
        }
        return false;
    } catch (err) {
        console.error("OpenCV error: ", err);
        return false;
    }
}
export function detectSmoking(ctx, canvas, video) { return false; }
export function detectPPE(ctx, canvas, video) { return false; }