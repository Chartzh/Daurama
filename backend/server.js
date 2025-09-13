const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const translations = {
    en: {
        instructions: {
            'plastic': 'Rinse and place in the plastic recycling bin. Check if it has a recycling symbol.',
            'cardboard': 'Flatten and place in the paper/cardboard recycling bin. Remove all tape.',
            'glass': 'Rinse and place in the glass recycling bin. Remove the cap.',
            'default': 'This item is not commonly recyclable. Please check local waste guidelines or consider reusing it.',
        },
        error: 'Failed to analyze image. Please try again.',
        object_name_display: 'Object',
        instructions_display: 'Recycling Instructions',
    },
    id: {
        instructions: {
            'plastic': 'Bilas dan letakkan di tempat sampah daur ulang plastik. Periksa apakah ada simbol daur ulang.',
            'cardboard': 'Ratakan dan letakkan di tempat sampah daur ulang kertas/kardus. Lepaskan semua selotip.',
            'glass': 'Bilas dan letakkan di tempat sampah daur ulang kaca. Lepaskan tutup botol.',
            'default': 'Barang ini tidak umum didaur ulang. Mohon periksa panduan limbah lokal atau pertimbangkan untuk menggunakannya kembali.',
        },
        error: 'Gagal menganalisis gambar. Silakan coba lagi.',
        object_name_display: 'Objek',
        instructions_display: 'Instruksi Daur Ulang',
    },
};

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.post('/analyze', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded.' });
    }

    const { lang } = req.body;
    const currentTranslations = translations[lang] || translations.en;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const imagePart = {
            inlineData: {
                data: fs.readFileSync(req.file.path).toString('base64'),
                mimeType: req.file.mimetype,
            },
        };

        const prompt = `Identify the primary object in the image related to recycling. Provide only a single, lowercase word or short phrase, without any other text. Examples: 'plastic bottle', 'cardboard box', 'glass jar'. If there are multiple objects, give a general category.`;
        
        const result = await model.generateContent([prompt, imagePart]);
        let objectName = result.response.text().trim().toLowerCase();

        fs.unlinkSync(req.file.path);

        // Cari terjemahan yang cocok menggunakan includes() untuk pencocokan parsial
        let instructions = currentTranslations.instructions.default;
        for (const key in currentTranslations.instructions) {
            if (objectName.includes(key) && key !== 'default') {
                instructions = currentTranslations.instructions[key];
                break;
            }
        }
        
        // Terjemahkan nama objek di sini, di server
        const translatedObjectName = currentTranslations.instructions[objectName] || objectName;

        res.json({ 
            object_name: translatedObjectName,
            instructions: instructions,
        });

    } catch (error) {
        console.error('Error during API call:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: currentTranslations.error });
    }
});

app.listen(port, () => {
    console.log('Server running on http://localhost:3000');
});