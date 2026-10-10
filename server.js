const http = require("http");
const fs = require("fs");
const path = require("path");
const si = require("systeminformation");

const PORT = 3000;
const TEMP_OFFSET = 40.2;

let stats = {
    cpu: 0,
    cpuTemp: null,
    cpuSpeed: 0,
    ramUsed: 0,
    ramTotal: 0,
    ramPercent: 0,
    disks: [],
    download: 0,
    upload: 0,
    uptime: 0,
    cpuName: "Unknown"
};


async function updateStats() {

    try {

        const [
            cpu,
            load,
            memory,
            disks,
            speed,
            network,
            time,
            temperature
        ] = await Promise.all([

            si.cpu(),

            si.currentLoad(),

            si.mem(),

            si.fsSize(),

            si.cpuCurrentSpeed(),

            si.networkStats(),

            si.time(),

            si.cpuTemperature()

        ]);


        let download = 0;
        let upload = 0;


        for (const adapter of network) {

            if (
                adapter.operstate === "up"
            ) {

                download +=
                    adapter.rx_sec || 0;

                upload +=
                    adapter.tx_sec || 0;

            }

        }


        stats = {

            cpu:
                Number(
                    load.currentLoad.toFixed(1)
                ),


            cpuTemp:
    temperature.main !== null
        ? Number(
            (temperature.main + TEMP_OFFSET).toFixed(1)
        )
        : null,


            cpuSpeed:
                speed.avg !== undefined
                    ? Number(
                        speed.avg.toFixed(2)
                    )
                    : 0,


            ramUsed:
                Number(
                    (
                        memory.active /
                        1024 /
                        1024 /
                        1024
                    ).toFixed(2)
                ),


            ramTotal:
                Number(
                    (
                        memory.total /
                        1024 /
                        1024 /
                        1024
                    ).toFixed(2)
                ),


            ramPercent:
                Number(
                    (
                        (
                            memory.active /
                            memory.total
                        ) * 100
                    ).toFixed(1)
                ),


            disks:
                disks.map(disk => ({

                    drive: disk.fs,

                    percent:
                        Number(
                            disk.use.toFixed(1)
                        ),

                    sizeGB:
                        Number(
                            (
                                disk.size /
                                1024 /
                                1024 /
                                1024
                            ).toFixed(1)
                        ),

                    usedGB:
                        Number(
                            (
                                disk.used /
                                1024 /
                                1024 /
                                1024
                            ).toFixed(1)
                        )

                })),


            download:
                Math.round(download),


            upload:
                Math.round(upload),


            uptime:
                time.uptime,


            cpuName:
                cpu.brand

        };

    }

    catch (error) {

        console.error(
            "Sensor error:",
            error.message
        );

    }

}


updateStats();

setInterval(
    updateStats,
    1000
);


// -------------------------
// FILE SERVER
// -------------------------

const mimeTypes = {

    ".html":
        "text/html",

    ".css":
        "text/css",

    ".js":
        "application/javascript"

};


const server =
    http.createServer(
        (req, res) => {


            // API

            if (
                req.url ===
                "/api/stats"
            ) {

                res.writeHead(
                    200,
                    {
                        "Content-Type":
                            "application/json",

                        "Cache-Control":
                            "no-cache"
                    }
                );

                res.end(
                    JSON.stringify(stats)
                );

                return;
            }


            // Static files

            let filePath;


            if (
                req.url === "/" ||
                req.url === "/index.html"
            ) {

                filePath =
                    path.join(
                        __dirname,
                        "public",
                        "index.html"
                    );

            }

            else {

                filePath =
                    path.join(
                        __dirname,
                        "public",
                        req.url
                    );

            }


            const extension =
                path.extname(filePath);


            const contentType =
                mimeTypes[extension] ||
                "application/octet-stream";


            fs.readFile(
                filePath,
                (error, data) => {

                    if (error) {

                        res.writeHead(
                            404
                        );

                        res.end(
                            "Not Found"
                        );

                        return;
                    }


                    res.writeHead(
                        200,
                        {
                            "Content-Type":
                                contentType
                        }
                    );


                    res.end(data);

                }
            );

        }
    );


server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "=============================="
        );

        console.log(
            "      PC STAT MONITOR"
        );

        console.log(
            "=============================="
        );

        console.log("");

        console.log(
            `Dashboard: http://localhost:${PORT}`
        );

        console.log(
            `API:       http://localhost:${PORT}/api/stats`
        );

        console.log("");

    }
);