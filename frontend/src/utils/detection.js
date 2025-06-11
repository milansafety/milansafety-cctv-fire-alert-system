// frontend/src/utils/detection.js
export function detectRedColor(ctx, canvas, video, createAlert) {
    const cv = window.cv;
        if (!cv || !video || video.videoWidth === 0) return false;

            try {
                    canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                            
                                                    const src = cv.imread(canvas);
                                                            const hsv = new cv.Mat();
                                                                    cv.cvtColor(src, hsv, cv.COLOR_RGBA2HSV, 0);

                                                                            let low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 120, 70, 0]);
                                                                                    let high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [10, 255, 255, 255]);
                                                                                            const mask = new cv.Mat();
                                                                                                    cv.inRange(hsv, low, high, mask);

                                                                                                            let nonZero = cv.countNonZero(mask);
                                                                                                                    let percentage = (nonZero / (src.rows * src.cols)) * 100;

                                                                                                                            src.delete(); hsv.delete(); mask.delete(); low.delete(); high.delete();

                                                                                                                                    if (percentage > 1) {
                                                                                                                                                console.log("Red color detected!", percentage);
                                                                                                                                                            createAlert('red_color');
                                                                                                                                                                        return true;
                                                                                                                                                                                }
                                                                                                                                                                                        return false;
                                                                                                                                                                                            } catch (err) {
                                                                                                                                                                                                    console.error("OpenCV error: ", err);
                                                                                                                                                                                                            return false;
                                                                                                                                                                                                                }
                                                                                                                                                                                                                }