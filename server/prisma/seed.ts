import { prisma } from "../src/lib/prisma.ts";

type SeedReport = {
    scamType: string;
    description: string;
    severity: number;
    daysAgo: number;
};

type SeedNumber = {
    number: string;
    reports: SeedReport[];
};

const SEED_DATA: SeedNumber[] = [
    {
        number: "+919812345678",
        reports: [
            {
                scamType: "Digital Arrest Scam",
                description:
                    "Caller claimed to be from Mumbai Cyber Crime, said a parcel in my name had drugs and I was under 'digital arrest'. Kept me on video call for 2 hours demanding ₹85,000 to 'clear my name'.",
                severity: 5,
                daysAgo: 2,
            },
            {
                scamType: "Digital Arrest Scam",
                description:
                    "Said he was a CBI officer and my Aadhaar was linked to money laundering. Threatened immediate arrest unless I transferred money to a 'verification account'.",
                severity: 5,
                daysAgo: 5,
            },
            {
                scamType: "Digital Arrest Scam",
                description:
                    "Fake police officer in uniform on video call, showed a fake arrest warrant with my name. Asked me not to disconnect or tell anyone.",
                severity: 5,
                daysAgo: 9,
            },
            {
                scamType: "Digital Arrest Scam",
                description:
                    "Pretended to be from TRAI, said my number would be blocked for illegal activity, then transferred me to a 'police officer' for digital arrest.",
                severity: 4,
                daysAgo: 14,
            },
            {
                scamType: "KYC/Bank Fraud",
                description:
                    "Same number also called claiming to be bank security, asked for OTP to 'stop a fraudulent transaction'.",
                severity: 4,
                daysAgo: 20,
            },
        ],
    },
    {
        number: "+919876501234",
        reports: [
            {
                scamType: "KYC/Bank Fraud",
                description:
                    "Said my SBI account would be frozen unless I update KYC immediately. Sent a link to a fake SBI page asking for net banking login.",
                severity: 4,
                daysAgo: 1,
            },
            {
                scamType: "KYC/Bank Fraud",
                description:
                    "Claimed to be from HDFC, asked me to download AnyDesk so they could 'help complete KYC'. Wanted screen access.",
                severity: 5,
                daysAgo: 4,
            },
            {
                scamType: "KYC/Bank Fraud",
                description:
                    "Automated call saying my debit card is blocked, press 1 to reactivate. Then a person asked for card number and CVV.",
                severity: 3,
                daysAgo: 11,
            },
            {
                scamType: "UPI Refund Scam",
                description:
                    "Said they accidentally sent ₹5,000 to my UPI and asked me to scan a QR code to 'return' it — scanning would have debited me.",
                severity: 4,
                daysAgo: 16,
            },
        ],
    },
    {
        number: "+918800223344",
        reports: [
            {
                scamType: "Lottery/Prize Scam",
                description:
                    "WhatsApp call saying I won ₹25 lakh in a KBC lucky draw. Asked for ₹6,500 'processing fee' and GST to release the prize.",
                severity: 3,
                daysAgo: 3,
            },
            {
                scamType: "Lottery/Prize Scam",
                description:
                    "Sent a fake KBC certificate with Amitabh Bachchan's photo and a winner ID, demanded refundable security deposit.",
                severity: 3,
                daysAgo: 8,
            },
            {
                scamType: "Lottery/Prize Scam",
                description:
                    "Said my SIM was selected in a Jio anniversary lottery, kept asking me to share OTP to 'verify the winner'.",
                severity: 2,
                daysAgo: 18,
            },
        ],
    },
    {
        number: "+917700991122",
        reports: [
            {
                scamType: "Fake Delivery/Courier Scam",
                description:
                    "Claimed to be FedEx, said a parcel with illegal items was seized at the airport in my name. Transferred me to fake 'customs police'.",
                severity: 5,
                daysAgo: 2,
            },
            {
                scamType: "Fake Delivery/Courier Scam",
                description:
                    "Said my Amazon order couldn't be delivered, asked me to pay a ₹2 redelivery fee on a link that stole my card details.",
                severity: 3,
                daysAgo: 6,
            },
            {
                scamType: "Fake Delivery/Courier Scam",
                description:
                    "Posed as Blue Dart, sent an OTP and asked me to read it back to 'confirm delivery address'. It was a banking OTP.",
                severity: 4,
                daysAgo: 13,
            },
            {
                scamType: "Digital Arrest Scam",
                description:
                    "After the courier story, switched to claiming I was involved in a narcotics case and needed to pay to avoid arrest.",
                severity: 5,
                daysAgo: 13,
            },
        ],
    },
    {
        number: "+919123456780",
        reports: [
            {
                scamType: "Job Scam",
                description:
                    "Offered a part-time work-from-home job liking YouTube videos, paid ₹150 first then asked me to deposit ₹10,000 for 'premium tasks'.",
                severity: 3,
                daysAgo: 1,
            },
            {
                scamType: "Job Scam",
                description:
                    "Claimed to be HR from a big MNC, said I was shortlisted but needed to pay a refundable registration and training fee.",
                severity: 3,
                daysAgo: 7,
            },
            {
                scamType: "Investment Scam",
                description:
                    "Added me to a Telegram group promising 30% daily returns on a stock tip app. Initial small withdrawal worked, then they blocked withdrawals.",
                severity: 4,
                daysAgo: 12,
            },
        ],
    },
    {
        number: "+918555012398",
        reports: [
            {
                scamType: "Investment Scam",
                description:
                    "Fake stock advisor guaranteeing fixed returns, pushed me to invest via a cloned trading app that showed fake profits.",
                severity: 4,
                daysAgo: 3,
            },
            {
                scamType: "Investment Scam",
                description:
                    "Crypto 'expert' promising to double USDT in 24 hours, asked for a deposit to a wallet and then went silent.",
                severity: 5,
                daysAgo: 10,
            },
            {
                scamType: "Investment Scam",
                description:
                    "Claimed SEBI-registered, sent a fake registration screenshot, asked for upfront 'membership' to a profit-sharing scheme.",
                severity: 3,
                daysAgo: 15,
            },
            {
                scamType: "Lottery/Prize Scam",
                description:
                    "Also told me I'd 'won' bonus trading capital that I could unlock by paying tax in advance.",
                severity: 2,
                daysAgo: 22,
            },
        ],
    },
    {
        number: "+919988776655",
        reports: [
            {
                scamType: "Electricity Bill Scam",
                description:
                    "SMS + call saying my electricity will be disconnected tonight as last month's bill wasn't updated. Asked to call a number and pay via a link.",
                severity: 3,
                daysAgo: 2,
            },
            {
                scamType: "Electricity Bill Scam",
                description:
                    "Posed as BSES officer, told me to install a 'bill payment app' (remote access app) to clear pending dues immediately.",
                severity: 4,
                daysAgo: 6,
            },
            {
                scamType: "Electricity Bill Scam",
                description:
                    "Threatened immediate power cut and demanded ₹11 'verification payment' on a UPI link to keep the connection.",
                severity: 3,
                daysAgo: 19,
            },
        ],
    },
    {
        number: "+917012345698",
        reports: [
            {
                scamType: "UPI Refund Scam",
                description:
                    "Said they were an OLX buyer, sent a fake 'payment received' screenshot and a QR code, insisting I scan it to get my money.",
                severity: 4,
                daysAgo: 1,
            },
            {
                scamType: "UPI Refund Scam",
                description:
                    "Claimed to process a Paytm cashback refund, generated a collect request and pressured me to approve and enter UPI PIN.",
                severity: 4,
                daysAgo: 5,
            },
            {
                scamType: "KYC/Bank Fraud",
                description:
                    "Asked me to share the UPI PIN to 'reverse a wrong transaction'. Got aggressive when I refused.",
                severity: 3,
                daysAgo: 17,
            },
        ],
    },
    {
        number: "+919345678012",
        reports: [
            {
                scamType: "Digital Arrest Scam",
                description:
                    "Claimed to be from Delhi Police Narcotics, video call with a fake police station background, demanded ₹2 lakh bail to avoid arrest.",
                severity: 5,
                daysAgo: 4,
            },
            {
                scamType: "Digital Arrest Scam",
                description:
                    "Said my bank account was used for terror funding, kept me on call and told me not to disconnect or contact family.",
                severity: 5,
                daysAgo: 8,
            },
            {
                scamType: "KYC/Bank Fraud",
                description:
                    "Follow-up call asking for full card details to 'verify and freeze the suspicious account'.",
                severity: 4,
                daysAgo: 12,
            },
            {
                scamType: "Fake Delivery/Courier Scam",
                description:
                    "Earlier the same number said a DHL parcel from abroad in my name was held by customs for drugs.",
                severity: 4,
                daysAgo: 21,
            },
            {
                scamType: "Investment Scam",
                description:
                    "Also pitched a 'government-backed' high-return bond scheme requiring an immediate transfer.",
                severity: 3,
                daysAgo: 26,
            },
        ],
    },
    {
        number: "+918123409876",
        reports: [
            {
                scamType: "Job Scam",
                description:
                    "Telegram task-based job: small payouts for hotel ratings, then asked for a 'merchant deposit' to unlock higher-paying tasks. Lost ₹18,000.",
                severity: 5,
                daysAgo: 2,
            },
            {
                scamType: "Job Scam",
                description:
                    "Said I was selected for a data-entry job, asked for a registration fee and a laptop security deposit.",
                severity: 2,
                daysAgo: 9,
            },
        ],
    },
];

async function main() {
    console.log("Seeding ScamReports...");

    // Idempotent: clear existing seeded reports (those with no reporterId) and any on the seed numbers.
    const seedNumbers = SEED_DATA.map((d) => d.number);
    const deleted = await prisma.scamReport.deleteMany({
        where: {
            OR: [{ reporterId: null }, { number: { in: seedNumbers } }],
        },
    });
    console.log(`Cleared ${deleted.count} existing seed report(s).`);

    let total = 0;
    for (const entry of SEED_DATA) {
        for (const r of entry.reports) {
            await prisma.scamReport.create({
                data: {
                    number: entry.number,
                    reporterId: null,
                    scamType: r.scamType,
                    description: r.description,
                    severity: r.severity,
                    createdAt: new Date(Date.now() - r.daysAgo * 24 * 60 * 60 * 1000),
                },
            });
            total++;
        }
    }

    const count = await prisma.scamReport.count();
    console.log(`Inserted ${total} ScamReport(s) across ${SEED_DATA.length} numbers.`);
    console.log(`Total ScamReports in database: ${count}`);
    console.log("Seeded numbers:");
    for (const entry of SEED_DATA) {
        console.log(`  ${entry.number} — ${entry.reports.length} reports`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("Seed failed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
