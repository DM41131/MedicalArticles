# Calculators Feature

## ✅ What's Been Added

### 1. **New Calculators Page**
Location: `client/src/pages/Calculators.jsx`

A comprehensive medical calculators page with:
- 12 different medical calculator types
- Category filtering system
- Beautiful card-based UI with hover effects
- Georgian language support
- Color-coded categories

### 2. **Implemented Calculators**

#### ✅ **BMI Calculator** (BMI კალკულატორი)
**Location:** `client/src/pages/calculators/BMICalculator.jsx`  
**Route:** `/calculators/bmi`

**Features:**
- Body Mass Index (BMI) calculation
- Body Surface Area (BSA) using Mosteller formula
- Standard BMI classification (6 categories)
- Asian BMI classification (WHO/NIH guidelines)
- Color-coded results
- Comprehensive interpretation table
- Georgian language support
- Metric system (kg, cm)

**Inputs:**
- Weight (kg)
- Height (cm)

**Outputs:**
- BMI value (kg/m²)
- BSA value (m²)
- Weight category classification
- Asian classification (where applicable)

#### ✅ **Creatinine Clearance Calculator** (კრეატინინის კლირენსის კალკულატორი)
**Location:** `client/src/pages/calculators/CreatinineClearance.jsx`  
**Route:** `/calculators/creatinine-clearance`

**Features:**
- Cockcroft-Gault equation
- Ideal Body Weight (IBW) calculation using Devine formula
- Adjusted Body Weight (ABW) for overweight/obese patients
- BMI calculation and categorization
- Automatic weight adjustment based on BMI
- Clinical interpretation (5 levels)
- Georgian language support
- Metric system (kg, cm)

**Inputs:**
- Age (years)
- Gender
- Weight (kg)
- Height (cm)
- Serum Creatinine (mg/dL)

**Outputs:**
- Creatinine Clearance (mL/min)
- BMI
- IBW (Ideal Body Weight)
- ABW (Adjusted Body Weight)
- Clinical interpretation

### 3. **Planned Calculator Types**

- **Heart Risk Calculator** (გულის რისკის კალკულატორი) - Cardiovascular risk assessment
- **Blood Pressure Monitor** (არტერიული წნევის მონიტორი) - Blood pressure tracking
- **Diabetes Risk Calculator** (დიაბეტის რისკის კალკულატორი) - Diabetes risk evaluation
- **Pregnancy Calculator** (ორსულობის კალკულატორი) - Due date and pregnancy tracking
- **Medication Dosage Calculator** (მედიკამენტის დოზის კალკულატორი) - Proper medication dosage
- **Calorie Calculator** (კალორიის კალკულატორი) - Daily calorie needs
- **Mental Health Assessment** (ფსიქიკური ჯანმრთელობის შეფასება) - Mental health screening
- **Vaccination Schedule** (ვაქცინაციის განრიგი) - Vaccination tracking
- **Drug Interaction Checker** (მედიკამენტების ურთიერთქმედების შემოწმება) - Medication interactions
- **Age Calculator** (ასაკის კალკულატორი) - Exact age calculation

### 4. **Categories**

Calculators are organized into the following categories:
- General Health
- Cardiology
- Endocrinology
- Obstetrics
- Pharmacy
- Nephrology
- Nutrition
- Psychology
- Preventive Care
- General

### 5. **Routing**

The following routes have been added to the application:
- `/calculators` - Main calculators page
- `/calculators/bmi` - BMI Calculator
- `/calculators/creatinine-clearance` - Creatinine Clearance Calculator

---

## 🚀 How to Add Navigation Link

To make the Calculators page accessible from the navigation menu, you need to add it via the **Admin Panel**:

### Option 1: Via Admin Dashboard

1. Login as admin
2. Go to **Admin Dashboard** → **Navigation Manager**
3. Add a new navigation item:
   - **Label**: `კალკულატორები` (Calculators)
   - **Path**: `/calculators`
   - **Order**: Set appropriate order (e.g., 3)

### Option 2: Manually via Database

If you have direct database access, you can add it to the `navigation` collection:

```javascript
{
  "name": "main",
  "items": [
    {
      "label": "კალკულატორები",
      "path": "/calculators",
      "order": 3
    }
  ]
}
```

---

## 🎨 Features

### Visual Design
- **Hero Section** with gradient background
- **Category Filter** chips for easy navigation
- **Calculator Cards** with:
  - Color-coded headers
  - Icon representation
  - Georgian name and description
  - Category badge
  - Hover animations

### User Experience
- Filter calculators by category
- Click any calculator card (currently logs to console)
- Responsive grid layout
- Professional medical theme

### Info Section
- Usage instructions in Georgian
- Medical disclaimer
- Gradient background for emphasis

---

## 📝 Next Steps - Implementation Guide

### To Implement Individual Calculators:

1. **Create Calculator Components**
   
   Create separate components for each calculator:
   ```
   client/src/components/calculators/
   ├── BMICalculator.jsx
   ├── HeartRiskCalculator.jsx
   ├── BloodPressureMonitor.jsx
   └── ... (other calculators)
   ```

2. **Update Calculators.jsx**
   
   Modify the `handleCalculatorClick` function to navigate to specific calculators:
   ```javascript
   const handleCalculatorClick = (calculatorId) => {
     navigate(`/calculators/${calculatorId}`);
   };
   ```

3. **Add Individual Routes**
   
   Add routes for each calculator in `routes.jsx`:
   ```javascript
   {
     path: '/calculators/bmi',
     element: (
       <Layout>
         <BMICalculator />
       </Layout>
     ),
   },
   ```

### Example: BMI Calculator Component

```jsx
import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(2));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        BMI კალკულატორი
      </Typography>
      <Box sx={{ mt: 4 }}>
        <TextField
          label="წონა (კგ)"
          type="number"
          fullWidth
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="სიმაღლე (სმ)"
          type="number"
          fullWidth
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={calculateBMI}>
          გამოთვლა
        </Button>
        {bmi && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4">
              თქვენი BMI: {bmi}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BMICalculator;
```

---

## 🎯 Current Status

✅ **Completed:**
- Calculators selection page created
- 12 calculator types defined
- Category filtering system
- Routing configured
- Georgian language support
- Professional UI design

⏳ **To Be Implemented:**
- Individual calculator logic
- Calculator input forms
- Result displays and interpretations
- Save/export functionality
- Medical reference information

---

## 📱 Responsive Design

The page is fully responsive:
- **Desktop**: 3-column grid
- **Tablet**: 2-column grid  
- **Mobile**: Single column
- Touch-friendly cards
- Adaptive typography

---

## 🔒 Security Note

Add appropriate disclaimers and ensure users understand that these calculators are for informational purposes only and should not replace professional medical advice.

---

## 🎨 Color Scheme

Each calculator has a unique color for easy identification:
- Green (#4CAF50) - General Health/Fitness
- Pink (#E91E63) - Heart/Pregnancy
- Blue (#2196F3) - Monitoring
- Orange (#FF9800) - Diabetes
- Purple (#9C27B0) - Medication
- Cyan (#00BCD4) - Kidney
- Deep Orange (#FF5722) - Nutrition
- Deep Purple (#673AB7) - Mental Health
- Teal (#009688) - Vaccination
- Brown (#795548) - Pharmacy
- Blue Grey (#607D8B) - General

---

## 📞 Support

For questions or issues with the Calculators feature, refer to the main documentation or contact the development team.

