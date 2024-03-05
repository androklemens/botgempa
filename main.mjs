
import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";

const token = "7048238077:AAE3RtSxaYzy1vDwJrrPYaHV_fq04uHiAYA";
const apiKeyUrl = "https://api.lolhuman.xyz/api/checkapikey?apikey=";
const options = {
    polling: true
}


const andro = new TelegramBot(token, options)

const prefix = "/"

const sayHi = new RegExp(`^${prefix}halo$`)
const gempa = new RegExp(`^${prefix}gempa$`)
const checkApiKeyCommand = new RegExp(`^${prefix}cekapikey (.+)$`)

andro.onText(checkApiKeyCommand, async (msg, match) => {
    try {
        const apiKey = match[1]; // Mendapatkan kunci API dari pesan
        const response = await fetch(apiKeyUrl + apiKey);
        const data = await response.json();
        // Lakukan sesuatu dengan data yang diterima dari API
        andro.sendMessage(msg.chat.id, "Ini adalah aksi dari perintah cekapikey.");
    } catch (error) {
        console.error("Error:", error);
        andro.sendMessage(msg.chat.id, "Error occurred while performing action. Please try again later.");
    }
})

andro.onText(sayHi, (msg) => {
    andro.sendMessage(msg.chat.id, "Halo juga!")
})

andro.onText(gempa, async (msg) => {
    try {
        const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
        const data = await response.json();

        const {
            Tanggal,
            Jam,
            Magnitude,
            Wilayah,
            Potensi,
            Kedalaman,
            Shakemap
        } = data.Infogempa.gempa;

        const BMKGImage = "https://data.bmkg.go.id/DataMKG/TEWS/" + Shakemap;

        const resultText = `
        Waktu: ${Tanggal} | ${Jam}
        Besaran: ${Magnitude} SR
        Wilayah: ${Wilayah}
        Potensi: ${Potensi}
        Kedalaman: ${Kedalaman}
        `;

        andro.sendPhoto(msg.chat.id, BMKGImage, {
            caption: resultText
        });
    } catch (error) {
        console.error("Error:", error);
        andro.sendMessage(msg.chat.id, "Error occurred while fetching data. Please try again later.");
    }
});
