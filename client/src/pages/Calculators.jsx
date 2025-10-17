import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Paper,
  alpha,
  Chip,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Favorite as FavoriteIcon,
  LocalHospital as LocalHospitalIcon,
  Vaccines as VaccinesIcon,
  Monitor as MonitorIcon,
  Psychology as PsychologyIcon,
  Medication as MedicationIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Healing as HealingIcon,
  ChildCare as ChildCareIcon,
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';

const calculatorTypes = [
  {
    id: 'bmi',
    name: 'BMI Calculator',
    nameGe: 'BMI კალკულატორი',
    description: 'Calculate Body Mass Index',
    descriptionGe: 'სხეულის მასის ინდექსის გამოთვლა',
    icon: <FitnessCenterIcon />,
    color: '#4CAF50',
    category: 'General Health',
  },
  {
    id: 'heart-risk',
    name: 'Heart Risk Calculator',
    nameGe: 'გულის რისკის კალკულატორი',
    description: 'Assess cardiovascular risk',
    descriptionGe: 'გულ-სისხლძარღვთა რისკის შეფასება',
    icon: <FavoriteIcon />,
    color: '#E91E63',
    category: 'Cardiology',
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure Monitor',
    nameGe: 'არტერიული წნევის მონიტორი',
    description: 'Track and analyze blood pressure',
    descriptionGe: 'არტერიული წნევის მონიტორინგი და ანალიზი',
    icon: <MonitorIcon />,
    color: '#2196F3',
    category: 'Cardiology',
  },
  {
    id: 'diabetes-risk',
    name: 'Diabetes Risk Calculator',
    nameGe: 'დიაბეტის რისკის კალკულატორი',
    description: 'Evaluate diabetes risk factors',
    descriptionGe: 'დიაბეტის რისკის ფაქტორების შეფასება',
    icon: <LocalHospitalIcon />,
    color: '#FF9800',
    category: 'Endocrinology',
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy Calculator',
    nameGe: 'ორსულობის კალკულატორი',
    description: 'Due date and pregnancy tracking',
    descriptionGe: 'მშობიარობის თარიღი და ორსულობის მონიტორინგი',
    icon: <ChildCareIcon />,
    color: '#E91E63',
    category: 'Obstetrics',
  },
  {
    id: 'medication-dosage',
    name: 'Medication Dosage Calculator',
    nameGe: 'მედიკამენტის დოზის კალკულატორი',
    description: 'Calculate proper medication dosage',
    descriptionGe: 'მედიკამენტის სწორი დოზის გამოთვლა',
    icon: <MedicationIcon />,
    color: '#9C27B0',
    category: 'Pharmacy',
  },
  {
    id: 'creatinine-clearance',
    name: 'Creatinine Clearance Calculator',
    nameGe: 'კრეატინინის კლირენსის კალკულატორი',
    description: 'Calculate CrCl using Cockcroft-Gault',
    descriptionGe: 'კრეატინინის კლირენსის გამოთვლა (Cockcroft-Gault)',
    icon: <HealingIcon />,
    color: '#00BCD4',
    category: 'Nephrology',
  },
  {
    id: 'calorie',
    name: 'Calorie Calculator',
    nameGe: 'კალორიის კალკულატორი',
    description: 'Daily calorie needs calculator',
    descriptionGe: 'დღიური კალორიების საჭიროების გამოთვლა',
    icon: <RestaurantIcon />,
    color: '#FF5722',
    category: 'Nutrition',
  },
  {
    id: 'mental-health',
    name: 'Mental Health Assessment',
    nameGe: 'ფსიქიკური ჯანმრთელობის შეფასება',
    description: 'Mental health screening tools',
    descriptionGe: 'ფსიქიკური ჯანმრთელობის სკრინინგი',
    icon: <PsychologyIcon />,
    color: '#673AB7',
    category: 'Psychology',
  },
  {
    id: 'vaccination',
    name: 'Vaccination Schedule',
    nameGe: 'ვაქცინაციის განრიგი',
    description: 'Track vaccination schedules',
    descriptionGe: 'ვაქცინაციის განრიგის მონიტორინგი',
    icon: <VaccinesIcon />,
    color: '#009688',
    category: 'Preventive Care',
  },
  {
    id: 'drug-interaction',
    name: 'Drug Interaction Checker',
    nameGe: 'მედიკამენტების ურთიერთქმედების შემოწმება',
    description: 'Check medication interactions',
    descriptionGe: 'მედიკამენტების ურთიერთქმედების შემოწმება',
    icon: <LocalPharmacyIcon />,
    color: '#795548',
    category: 'Pharmacy',
  },
  {
    id: 'age',
    name: 'Age Calculator',
    nameGe: 'ასაკის კალკულატორი',
    description: 'Calculate exact age and milestones',
    descriptionGe: 'ზუსტი ასაკისა და მნიშვნელოვანი თარიღების გამოთვლა',
    icon: <CalculateIcon />,
    color: '#607D8B',
    category: 'General',
  },
  {
    id: 'wells-dvt',
    name: 'Wells\' Criteria for DVT',
    nameGe: 'Wells-ის კრიტერიუმები DVT-სთვის',
    description: 'Deep vein thrombosis risk assessment',
    descriptionGe: 'ღრმა ვენური თრომბოზის რისკის შეფასება',
    icon: <HealingIcon />,
    color: '#00BCD4',
    category: 'Cardiology',
  },
  {
    id: 'glasgow-coma-scale',
    name: 'Glasgow Coma Scale (GCS)',
    nameGe: 'Glasgow Coma Scale (GCS)',
    description: 'Consciousness level assessment',
    descriptionGe: 'ცნობიერების დონის შეფასება',
    icon: <PsychologyIcon />,
    color: '#9C27B0',
    category: 'Neurology',
  },
  {
    id: 'gupta-mica',
    name: 'Gupta Perioperative Risk (MICA)',
    nameGe: 'Gupta პერიოპერაციული რისკი (MICA)',
    description: 'MI or cardiac arrest risk during surgery',
    descriptionGe: 'MI ან გულის გაჩერების რისკი ოპერაციის დროს',
    icon: <FavoriteIcon />,
    color: '#E91E63',
    category: 'Cardiology',
  },
];

const Calculators = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(calculatorTypes.map(calc => calc.category))];

  const filteredCalculators = selectedCategory === 'All'
    ? calculatorTypes
    : calculatorTypes.filter(calc => calc.category === selectedCategory);

  const handleCalculatorClick = (calculatorId) => {
    // Navigate to specific calculator page
    const implementedCalculators = [
      'bmi',
      'heart-risk',
      'blood-pressure',
      'diabetes-risk',
      'pregnancy',
      'medication-dosage',
      'creatinine-clearance',
      'calorie',
      'mental-health',
      'vaccination',
      'drug-interaction',
      'age',
      'wells-dvt',
      'glasgow-coma-scale',
      'gupta-mica',
    ];

    if (implementedCalculators.includes(calculatorId)) {
      navigate(`/calculators/${calculatorId}`);
    } else {
      alert('ეს კალკულატორი ჯერ არ არის დანერგილი');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <CalculateIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              სამედიცინო კალკულატორები
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
              პროფესიონალური სამედიცინო კალკულატორები ჯანმრთელობის შესაფასებლად და მონიტორინგისთვის
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Category Filter */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            კატეგორიები
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mt: 2 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{
                  fontSize: '1rem',
                  py: 2.5,
                  px: 1,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Calculators Grid */}
        <Grid container spacing={3}>
          {filteredCalculators.map((calculator) => (
            <Grid item xs={12} sm={6} md={4} key={calculator.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 24px ${alpha(calculator.color, 0.3)}`,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCalculatorClick(calculator.id)}
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${calculator.color} 0%, ${alpha(calculator.color, 0.7)} 100%)`,
                      color: 'white',
                      p: 3,
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        bgcolor: alpha('#fff', 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        mb: 2,
                        '& svg': {
                          fontSize: 40,
                        },
                      }}
                    >
                      {calculator.icon}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {calculator.nameGe}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {calculator.descriptionGe}
                    </Typography>
                    <Chip
                      label={calculator.category}
                      size="small"
                      sx={{
                        backgroundColor: alpha(calculator.color, 0.1),
                        color: calculator.color,
                        fontWeight: 600,
                      }}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Info Section */}
        <Paper
          elevation={3}
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            როგორ გამოვიყენოთ კალკულატორები?
          </Typography>
          <Typography variant="body1" paragraph>
            ჩვენი სამედიცინო კალკულატორები შექმნილია ჯანდაცვის პროფესიონალებისა და პაციენტებისთვის.
            აირჩიეთ სასურველი კალკულატორი და შეიყვანეთ საჭირო მონაცემები ზუსტი შედეგების მისაღებად.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            ⚠️ გაფრთხილება: ეს კალკულატორები ინფორმაციული მიზნებისთვისაა. სამედიცინო გადაწყვეტილებების
            მიღებამდე აუცილებლად გაიარეთ კონსულტაცია ექიმთან.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default Calculators;

