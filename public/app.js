const cpuUsage =
    document.getElementById("cpuUsage");

const cpuRing =
    document.getElementById("cpuRing");

const cpuTemp =
    document.getElementById("cpuTemp");

const cpuSpeed =
    document.getElementById("cpuSpeed");

const cpuName =
    document.getElementById("cpuName");

const ramPercent =
    document.getElementById("ramPercent");

const ramBar =
    document.getElementById("ramBar");

const ramUsed =
    document.getElementById("ramUsed");

const ramTotal =
    document.getElementById("ramTotal");

const ramStatus =
    document.getElementById("ramStatus");

const disks =
    document.getElementById("disks");

const download =
    document.getElementById("download");

const upload =
    document.getElementById("upload");

const uptime =
    document.getElementById("uptime");

const clock =
    document.getElementById("clock");


// ========================================
// NETWORK FORMAT
// ========================================

function formatSpeed(bytes) {

    if (bytes < 1024) {

        return `${bytes} B/s`;
    }

    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB/s`;
    }

    if (bytes < 1024 * 1024 * 1024) {

        return `${(
            bytes /
            1024 /
            1024
        ).toFixed(1)} MB/s`;
    }

    return `${(
        bytes /
        1024 /
        1024 /
        1024
    ).toFixed(1)} GB/s`;
}


// ========================================
// UPTIME FORMAT
// ========================================

function formatUptime(seconds) {

    const days =
        Math.floor(seconds / 86400);

    seconds %= 86400;

    const hours =
        Math.floor(seconds / 3600);

    seconds %= 3600;

    const minutes =
        Math.floor(seconds / 60);


    if (days > 0) {

        return `${days}d ${hours}h`;
    }

    return `${hours}h ${minutes}m`;
}


// ========================================
// RAM STATUS
// ========================================

function getRamStatus(percent) {

    if (percent >= 90) {

        return "HIGH";
    }

    if (percent >= 80) {

        return "BUSY";
    }

    return "NORMAL";
}


// ========================================
// UPDATE DASHBOARD
// ========================================

async function updateDashboard() {

    try {

        const response =
            await fetch(
                "/api/stats",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "API unavailable"
            );
        }


        const data =
            await response.json();


        // ----------------------------
        // CPU
        // ----------------------------

        const cpu =
            Math.max(
                0,
                Math.min(
                    100,
                    data.cpu
                )
            );


        cpuUsage.textContent =
            `${cpu.toFixed(0)}%`;


        const degrees =
            cpu * 3.6;


        cpuRing.style.background =
            `conic-gradient(
                var(--accent)
                ${degrees}deg,
                var(--track)
                ${degrees}deg
            )`;


        cpuName.textContent =
            data.cpuName;


        // ----------------------------
        // CPU TEMPERATURE
        // ----------------------------

        if (
            data.cpuTemp !== null &&
            Number.isFinite(data.cpuTemp)
        ) {

            cpuTemp.textContent =
                `${data.cpuTemp.toFixed(1)}°C`;

        } else {

            cpuTemp.textContent =
                "--°C";
        }


        // ----------------------------
        // CPU SPEED
        // ----------------------------

        cpuSpeed.textContent =
            `${data.cpuSpeed.toFixed(2)} GHz`;


        // ----------------------------
        // RAM
        // ----------------------------

        ramPercent.textContent =
            `${data.ramPercent.toFixed(1)}%`;


        ramBar.style.width =
            `${Math.min(
                100,
                data.ramPercent
            )}%`;


        ramUsed.textContent =
            `${data.ramUsed.toFixed(2)} GB`;


        ramTotal.textContent =
            `/ ${data.ramTotal.toFixed(2)} GB`;


        ramStatus.textContent =
            getRamStatus(
                data.ramPercent
            );


        // ----------------------------
        // STORAGE
        // ----------------------------

        disks.innerHTML = "";


        data.disks.forEach(
            disk => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "disk-row";


                row.innerHTML = `

                    <span class="disk-name">
                        ${disk.drive}
                    </span>

                    <div>

                        <div class="disk-track">

                            <div
                                class="disk-fill"
                                style="
                                    width:
                                    ${disk.percent}%
                                "
                            ></div>

                        </div>

                        <div
                            class="disk-details"
                        >
                            ${disk.usedGB}
                            GB /
                            ${disk.sizeGB}
                            GB
                        </div>

                    </div>

                    <span
                        class="disk-percent"
                    >
                        ${disk.percent}%
                    </span>

                `;


                disks.appendChild(row);
            }
        );


        // ----------------------------
        // NETWORK
        // ----------------------------

        download.textContent =
            formatSpeed(
                data.download
            );


        upload.textContent =
            formatSpeed(
                data.upload
            );


        // ----------------------------
        // UPTIME
        // ----------------------------

        uptime.textContent =
            formatUptime(
                data.uptime
            );

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }
}


// ========================================
// CLOCK
// ========================================

function updateClock() {

    const now =
        new Date();


    clock.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour12: false
            }
        );
}


updateClock();


setInterval(
    updateClock,
    1000
);


// ========================================
// SENSOR UPDATE
// ========================================

updateDashboard();


setInterval(
    updateDashboard,
    1000
);