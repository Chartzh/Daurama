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
            'aluminum': 'Rinse and place in the metal recycling bin. Remove any labels if possible.',
            'paper': 'Place in the paper recycling bin. Remove any plastic coating or tape.',
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
            'aluminum': 'Bilas dan letakkan di tempat sampah daur ulang logam. Lepaskan label jika memungkinkan.',
            'paper': 'Letakkan di tempat sampah daur ulang kertas. Lepaskan lapisan plastik atau selotip.',
            'default': 'Barang ini tidak umum didaur ulang. Mohon periksa panduan limbah lokal atau pertimbangkan untuk menggunakannya kembali.',
        },
        error: 'Gagal menganalisis gambar. Silakan coba lagi.',
        object_name_display: 'Objek',
        instructions_display: 'Instruksi Daur Ulang',
    },
};

// Database mock untuk material dan dampak lingkungan
const materialDatabase = {
    'plastic bottle': {
        type: 'anorganik',
        material: 'PET (Polyethylene Terephthalate)',
        eco_impact: {
            co2: '250g',
            energy: '3 jam menyalakan lampu LED',
            water: '2.5 liter air bersih',
            decompose_time: '450 tahun'
        }
    },
    'plastic bag': {
        type: 'anorganik',
        material: 'LDPE (Low-Density Polyethylene)',
        eco_impact: {
            co2: '150g',
            energy: '1.5 jam menyalakan lampu LED',
            water: '1.2 liter air bersih',
            decompose_time: '20 tahun'
        }
    },
    'glass bottle': {
        type: 'kaca',
        material: 'Kaca Soda-Lime',
        eco_impact: {
            co2: '400g',
            energy: '5 jam menyalakan lampu LED',
            water: '0.5 liter air bersih',
            decompose_time: '1000 tahun'
        }
    },
    'glass jar': {
        type: 'kaca',
        material: 'Kaca Borosilikat',
        eco_impact: {
            co2: '350g',
            energy: '4 jam menyalakan lampu LED',
            water: '0.4 liter air bersih',
            decompose_time: '1000 tahun'
        }
    },
    'cardboard box': {
        type: 'organik',
        material: 'Corrugated Cardboard',
        eco_impact: {
            co2: '100g',
            energy: '1 jam menyalakan lampu LED',
            water: '5 liter air bersih',
            decompose_time: '3 bulan'
        }
    },
    'paper': {
        type: 'organik',
        material: 'Recycled Paper',
        eco_impact: {
            co2: '80g',
            energy: '0.8 jam menyalakan lampu LED',
            water: '4 liter air bersih',
            decompose_time: '2 bulan'
        }
    },
    'aluminum can': {
        type: 'anorganik',
        material: 'Aluminum Alloy 3004',
        eco_impact: {
            co2: '500g',
            energy: '8 jam menyalakan lampu LED',
            water: '1 liter air bersih',
            decompose_time: '200 tahun'
        }
    },
    'tin can': {
        type: 'anorganik',
        material: 'Tinplate Steel',
        eco_impact: {
            co2: '300g',
            energy: '4 jam menyalakan lampu LED',
            water: '1.5 liter air bersih',
            decompose_time: '50 tahun'
        }
    }
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

        const prompt = `Identify the primary object in the image related to recycling. Provide only a single, lowercase word or short phrase, without any other text. Examples: 'plastic bottle', 'cardboard box', 'glass jar', 'aluminum can'. If there are multiple objects, give the most prominent recyclable item.`;
        
        const result = await model.generateContent([prompt, imagePart]);
        let objectName = result.response.text().trim().toLowerCase();

        fs.unlinkSync(req.file.path);

        // Cari data material dari database
        let materialData = materialDatabase[objectName] || {
            type: 'anorganik',
            material: 'Unknown Material',
            eco_impact: {
                co2: '100g',
                energy: '1 jam menyalakan lampu LED',
                water: '1 liter air bersih',
                decompose_time: 'Tidak diketahui'
            }
        };

        // Cari terjemahan instruksi yang cocok
        let instructions = currentTranslations.instructions.default;
        for (const key in currentTranslations.instructions) {
            if (objectName.includes(key) && key !== 'default') {
                instructions = currentTranslations.instructions[key];
                break;
            }
        }

        // Respons yang diperkaya dengan data dampak lingkungan
        res.json({ 
            object_name: objectName,
            type: materialData.type,
            material: materialData.material,
            instructions: instructions,
            eco_impact: materialData.eco_impact,
            timestamp: new Date().toISOString()
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