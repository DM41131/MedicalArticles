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
  Medication as MedicationIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MedicationDosageCalculator = () => {
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [medicationType, setMedicationType] = useState('paracetamol');
  const [result, setResult] = useState(null);

  // Common medication dosages (mg/kg)
  const medications = {
    paracetamol: { name: 'პარაცეტამოლი', dose: 15, maxDaily: 60, unit: 'mg/kg' },
    ibuprofen: { name: 'იბუპროფენი', dose: 10, maxDaily: 40, unit: 'mg/kg' },
    amoxicillin: { name: 'ამოქსიცილინი', dose: 25, maxDaily: 90, unit: 'mg/kg' },
  };

  const calculateDosage = () => {
    if (!weight || !age) {
      alert('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    const weightKg = parseFloat(weight);
    const med = medications[medicationType];
    
    const singleDose = weightKg * med.dose;
    const maxDailyDose = weightKg * med.maxDaily;
    const timesPerDay = Math.floor(maxDailyDose / singleDose);

    setResult({
      medication: med.name,
      singleDose: singleDose.toFixed(1),
      maxDailyDose: maxDailyDose.toFixed(1),
      timesPerDay,
    });
  };

  const handleReset = () => {
    setWeight('');
    setAge('');
    setMedicationType('paracetamol');
    setResult(null);
  };

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
            <MedicationIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                მედიკამენტის დოზის კალკულატორი
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                პედიატრიული დოზის გამოთვლა წონის მიხედვით
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            მნიშვნელოვანი გაფრთხილება!
          </Typography>
          <Typography variant="body2">
            ეს კალკულატორი მხოლოდ საინფორმაციო მიზნებისთვისაა და არ ცვლის ექიმის რეცეპტს. არასოდეს მიეცით მედიკამენტი ბავშვს ექიმის კონსულტაციის გარეშე. ყოველთვის მიჰყევით ექიმის ან ფარმაცევტის მითითებებს.
          </Typography>
        </Alert>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                პაციენტის მონაცემები
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="წონა (კგ)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ასაკი (წლები)"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>მედიკამენტი</InputLabel>
                    <Select value={medicationType} label="მედიკამენტი" onChange={(e) => setMedicationType(e.target.value)}>
                      <MenuItem value="paracetamol">პარაცეტამოლი (ტკივილგამაყუჩებელი/ცხელების დამწევი)</MenuItem>
                      <MenuItem value="ibuprofen">იბუპროფენი (ანთების საწინააღმდეგო)</MenuItem>
                      <MenuItem value="amoxicillin">ამოქსიცილინი (ანტიბიოტიკი)</MenuItem>
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
                      onClick={calculateDosage}
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
                    background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    რეკომენდებული დოზა
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    {result.medication}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h3" fontWeight="bold">
                      {result.singleDose} მგ
                    </Typography>
                    <Typography variant="h6">
                      ერთ დოზაზე
                    </Typography>
                  </Box>
                </Card>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    დოზირების ინფორმაცია
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > div': { mb: 1.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">ერთჯერადი დოზა:</Typography>
                      <Typography fontWeight="bold">{result.singleDose} მგ</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">მაქსიმალური დღიური დოზა:</Typography>
                      <Typography fontWeight="bold">{result.maxDailyDose} მგ</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">მიღების სიხშირე:</Typography>
                      <Typography fontWeight="bold">{result.timesPerDay}ჯერ დღეში</Typography>
                    </Box>
                  </Box>
                </Paper>

                <Alert severity="warning" sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    მნიშვნელოვანი:
                  </Typography>
                  <Typography variant="body2">
                    • ეს არის საორიენტაციო დოზა<br />
                    • აუცილებელია ექიმის დანიშნულება<br />
                    • არ გადააჭარბოთ მაქსიმალურ დოზას<br />
                    • შეინახეთ მედიკამენტები ბავშვების მიუწვდომელ ადგილას
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
                  <MedicationIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეავსეთ ველები დოზის გამოსათვლელად
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="error">
            გაფრთხილებები და უკუჩვენებები
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              კატეგორიულად აკრძალულია:
            </Typography>
            <Typography variant="body2">
              • თვითმკურნალობა ექიმის კონსულტაციის გარეშე<br />
              • დოზის თვითნებური ცვლილება<br />
              • მედიკამენტების გაზიარება სხვა ბავშვებთან<br />
              • ვადაგასული მედიკამენტების გამოყენება
            </Typography>
          </Alert>

          <Alert severity="warning">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              რისთვის გამოიყენება:
            </Typography>
            <Typography variant="body2">
              • <strong>პარაცეტამოლი:</strong> ტკივილის და ცხელების დაწევა<br />
              • <strong>იბუპროფენი:</strong> ანთება, ტკივილი, ცხელება<br />
              • <strong>ამოქსიცილინი:</strong> ბაქტერიული ინფექციები (მხოლოდ ექიმის დანიშნულებით)
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default MedicationDosageCalculator;

