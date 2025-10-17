import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  Divider,
  Alert,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CalorieCalculator = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState(null);

  const calculateCalories = () => {
    if (!age || !weight || !heightCm) {
      alert('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    const ageNum = parseInt(age);
    const weightKg = parseFloat(weight);
    const height = parseFloat(heightCm);

    // Mifflin-St Jeor Equation for BMR
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * height - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * height - 5 * ageNum - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Goal adjustments
    let targetCalories, description;
    if (goal === 'lose') {
      targetCalories = tdee - 500;
      description = 'წონის კლებისთვის (0.5 კგ/კვირაში)';
    } else if (goal === 'gain') {
      targetCalories = tdee + 500;
      description = 'წონის მატებისთვის (0.5 კგ/კვირაში)';
    } else {
      targetCalories = tdee;
      description = 'წონის შენარჩუნებისთვის';
    }

    // Macronutrient distribution (balanced diet)
    const protein = Math.round((targetCalories * 0.30) / 4); // 30% calories, 4 cal/g
    const carbs = Math.round((targetCalories * 0.40) / 4); // 40% calories, 4 cal/g
    const fats = Math.round((targetCalories * 0.30) / 9); // 30% calories, 9 cal/g

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      description,
      protein,
      carbs,
      fats,
    });
  };

  const handleReset = () => {
    setAge('');
    setGender('male');
    setWeight('');
    setHeightCm('');
    setActivityLevel('moderate');
    setGoal('maintain');
    setResult(null);
  };

  const activityLevels = [
    { value: 'sedentary', label: 'უმოძრაო (ოფისი, არა ვარჯიში)', multiplier: '1.2' },
    { value: 'light', label: 'მსუბუქი (ვარჯიში 1-3 დღე/კვირაში)', multiplier: '1.375' },
    { value: 'moderate', label: 'ზომიერი (ვარჯიში 3-5 დღე/კვირაში)', multiplier: '1.55' },
    { value: 'active', label: 'აქტიური (ვარჯიში 6-7 დღე/კვირაში)', multiplier: '1.725' },
    { value: 'veryActive', label: 'ძალიან აქტიური (ინტენსიური ვარჯიში 2ჯერ/დღეში)', multiplier: '1.9' },
  ];

  return (
    <>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 4 }}>
        <Container maxWidth="lg">
          <Button
            component={Link}
            to="/calculators"
            variant="outlined"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              mb: 2,
              '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.1) }
            }}
          >
            ← უკან კალკულატორებზე
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <RestaurantIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                კალორიის კალკულატორი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ყოველდღიური კალორიების საჭიროების გამოთვლა
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                მონაცემების შეყვანა
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="ასაკი (წლები)"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>სქესი</InputLabel>
                    <Select value={gender} label="სქესი" onChange={(e) => setGender(e.target.value)}>
                      <MenuItem value="male">მამრობითი</MenuItem>
                      <MenuItem value="female">მდედრობითი</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="წონა (კგ)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="სიმაღლე (სმ)"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>აქტივობის დონე</InputLabel>
                    <Select value={activityLevel} label="აქტივობის დონე" onChange={(e) => setActivityLevel(e.target.value)}>
                      {activityLevels.map((level) => (
                        <MenuItem key={level.value} value={level.value}>
                          {level.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>მიზანი</InputLabel>
                    <Select value={goal} label="მიზანი" onChange={(e) => setGoal(e.target.value)}>
                      <MenuItem value="lose">წონის კლება</MenuItem>
                      <MenuItem value="maintain">წონის შენარჩუნება</MenuItem>
                      <MenuItem value="gain">წონის მატება</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CalculateIcon />}
                      onClick={calculateCalories}
                    >
                      გამოთვლა
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<RestartAltIcon />}
                      onClick={handleReset}
                    >
                      გასუფთავება
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            {result ? (
              <>
                <Card
                  elevation={4}
                  sx={{
                    background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    ყოველდღიური კალორიები
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    {result.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {result.targetCalories}
                    </Typography>
                    <Typography variant="h6">
                      კალორია/დღეში
                    </Typography>
                  </Box>
                </Card>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    მეტაბოლური მაჩვენებლები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > div': { mb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">ბაზალური მეტაბოლიზმი (BMR):</Typography>
                      <Typography fontWeight="bold">{result.bmr} კალ</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">სრული დანახარჯი (TDEE):</Typography>
                      <Typography fontWeight="bold">{result.tdee} კალ</Typography>
                    </Box>
                  </Box>
                </Paper>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    მაკრონუტრიენტების განაწილება
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > div': { mb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">ცილა (30%):</Typography>
                      <Typography fontWeight="bold">{result.protein} გ/დღე</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">ნახშირწყლები (40%):</Typography>
                      <Typography fontWeight="bold">{result.carbs} გ/დღე</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">ცხიმები (30%):</Typography>
                      <Typography fontWeight="bold">{result.fats} გ/დღე</Typography>
                    </Box>
                  </Box>
                </Paper>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    {goal === 'lose' && '500 კალორიის დეფიციტი დაახლოებით 0.5 კგ წონის დაკლებას უზრუნველყოფს კვირაში.'}
                    {goal === 'gain' && '500 კალორიის პლუსი დაახლოებით 0.5 კგ წონის მატებას უზრუნველყოფს კვირაში.'}
                    {goal === 'maintain' && 'ეს კალორიები უზრუნველყოფს თქვენი მიმდინარე წონის შენარჩუნებას.'}
                  </Typography>
                </Alert>
              </>
            ) : (
              <Paper
                elevation={3}
                sx={{
                  p: 6,
                  borderRadius: 3,
                  textAlign: 'center',
                  minHeight: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box>
                  <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეავსეთ ველები კალორიების გამოსათვლელად
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ინფორმაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Mifflin-St Jeor ფორმულა:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              მამაკაცი: BMR = (10 × წონა კგ) + (6.25 × სიმაღლე სმ) - (5 × ასაკი) + 5<br />
              ქალი: BMR = (10 × წონა კგ) + (6.25 × სიმაღლე სმ) - (5 × ასაკი) - 161<br />
              TDEE = BMR × აქტივობის კოეფიციენტი
            </Typography>
          </Alert>

          <Alert severity="warning">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              რჩევები:
            </Typography>
            <Typography variant="body2">
              • ეს არის მიახლოებითი მაჩვენებლები, ინდივიდუალური შედეგები შეიძლება განსხვავდებოდეს<br />
              • მკვეთრი კალორიების შემცირება (&gt;1000 კალ/დღე) არ არის რეკომენდებული<br />
              • დიეტის დაწყებამდე გაიარეთ კონსულტაცია დიეტოლოგთან ან ექიმთან<br />
              • აწონ-დაწონეთ თქვენი კალორიების მიღება შედეგების მიხედვით
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default CalorieCalculator;

