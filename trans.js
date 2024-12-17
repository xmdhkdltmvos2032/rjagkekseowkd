const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');

// Telegram 봇 API 토큰과 채팅 ID 설정
const TELEGRAM_TOKEN = '7792346819:AAGmBVfnVBXOD_cit_Kbzwv7qdqOlGUp_4E'; // Telegram 봇 API 토큰
const CHAT_ID = '7502254593'; // Telegram 메시지를 받을 채팅 ID

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const INSTAGRAM_USERNAME = 'jbh2032'; // 감시할 Instagram 계정
let lastPostId = "B9EwAdIBARs"; // 마지막으로 확인한 게시물 ID

async function scrapeInstagram() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('article'); // 게시물 로드 대기

    // 페이지에서 게시물 링크와 ID 추출
    const postLinks = await page.evaluate(() => {
        const links = [];
        const anchors = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
        anchors.forEach(anchor => {
            links.push({
                url: anchor.href,
                id: anchor.href.split('/').slice(-2, -1)[0], // URL에서 ID 추출
            });
        });
        return links;
    });

    // 새 게시물 체크
    if (postLinks.length > 0) {
        const latestPost = postLinks[0]; // 가장 최근 게시물
        if (latestPost.id !== lastPostId) {
            lastPostId = latestPost.id; // 최신 게시물 ID 업데이트
            await sendTelegramMessage(latestPost.url); // Telegram 메시지 보내기
        }
    }

    await browser.close();
}

// Telegram 메시지 전송 함수
async function sendTelegramMessage(postUrl) {
    const message = `새로운 게시물/릴스 알림!\n 링크: ${postUrl}`;
    try {
        await bot.sendMessage(CHAT_ID, message);
        console.log("Telegram 메시지 전송 성공:", message);
    } catch (error) {
        console.error("Telegram 메시지 전송 실패:", error);
    }
}

// 주기적으로 Instagram 확인 (예: 1분마다)
setInterval(scrapeInstagram, 30000);  // 1분마다 확인
