document.addEventListener("DOMContentLoaded", () => {
    let pdfDoc = null,
        pageNum = 1,
        scale = 1.5,
        canvas = document.getElementById("pdf-render"),
        ctx = canvas.getContext("2d"),
        progressBar = document.getElementById("progress-bar");

    function renderPage(num) {
        pdfDoc.getPage(num).then(page => {
            let viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            let renderCtx = {
                canvasContext: ctx,
                viewport: viewport
            };
            page.render(renderCtx);
        });
    }

    document.getElementById("upload").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            progressBar.style.display = "block";
            const fileReader = new FileReader();
            fileReader.onprogress = function (e) {
                if (e.lengthComputable) {
                    let percentComplete = (e.loaded / e.total) * 100;
                    progressBar.value = percentComplete;
                }
            };
            fileReader.onload = function () {
                progressBar.style.display = "none";
                const typedArray = new Uint8Array(this.result);
                pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                    pdfDoc = pdf;
                    renderPage(pageNum);
                });
            };
            fileReader.readAsArrayBuffer(file);
        }
    });

    document.getElementById("zoom-in").addEventListener("click", () => {
        scale += 0.2;
        renderPage(pageNum);
    });

    document.getElementById("zoom-out").addEventListener("click", () => {
        scale -= 0.2;
        renderPage(pageNum);
    });

    document.getElementById("download").addEventListener("click", () => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL("application/pdf");
        link.download = "downloaded.pdf";
        link.click();
    });

    document.getElementById("bookmark").addEventListener("click", () => {
        alert(`Bookmarked page ${pageNum}`);
    });
});