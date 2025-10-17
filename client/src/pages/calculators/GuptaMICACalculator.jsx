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
  Chip,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const GuptaMICACalculator = () => {
  const [age, setAge] = useState('');
  const [functionalStatus, setFunctionalStatus] = useState('');
  const [asaClass, setAsaClass] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [procedureType, setProcedureType] = useState('');
  const [result, setResult] = useState(null);

  const functionalStatusOptions = [
    { value: 'independent', label: 'დამოუკიდებელი', labelEn: 'Independent', points: 0 },
    { value: 'partial', label: 'ნაწილობრივ დამოკიდებული', labelEn: 'Partially dependent', points: 0.65 },
    { value: 'total', label: 'მთლიანად დამოკიდებული', labelEn: 'Totally dependent', points: 1.03 },
  ];

  const asaClassOptions = [
    { value: '1', label: 'ASA 1: ნორმალური ჯანმრთელი პაციენტი', labelEn: 'Normal healthy patient', points: -5.17 },
    { value: '2', label: 'ASA 2: მსუბუქი სისტემური დაავადება', labelEn: 'Mild systemic disease', points: -3.29 },
    { value: '3', label: 'ASA 3: მძიმე სისტემური დაავადება', labelEn: 'Severe systemic disease', points: -1.92 },
    { value: '4', label: 'ASA 4: მუდმივი საფრთხე სიცოცხლისთვის', labelEn: 'Constant threat to life', points: -0.95 },
    { value: '5', label: 'ASA 5: მომაკვდავი, ვერ გადარჩება ოპერაციის გარეშე', labelEn: 'Moribund, not expected to survive', points: 0 },
  ];

  const creatinineOptions = [
    { value: 'normal', label: 'ნორმალური (≤1.5 mg/dL)', labelEn: 'Normal (≤1.5 mg/dL)', points: 0 },
    { value: 'elevated', label: 'მომატებული (>1.5 mg/dL)', labelEn: 'Elevated (>1.5 mg/dL)', points: 0.61 },
    { value: 'unknown', label: 'უცნობი', labelEn: 'Unknown', points: -0.10 },
  ];

  const procedureTypes = [
    { value: 'anorectal', label: 'ანორექტალური', labelEn: 'Anorectal', points: -0.16 },
    { value: 'aortic', label: 'აორტული', labelEn: 'Aortic', points: 1.60 },
    { value: 'bariatric', label: 'ბარიატრიული', labelEn: 'Bariatric', points: -0.25 },
    { value: 'brain', label: 'ტვინის', labelEn: 'Brain', points: 1.40 },
    { value: 'breast', label: 'მკერდის', labelEn: 'Breast', points: -1.61 },
    { value: 'cardiac', label: 'გულის', labelEn: 'Cardiac', points: 1.01 },
    { value: 'ent', label: 'ყელ-ყურ-ცხვირის (გარდა ფარისებრი/პარაფარისებრი)', labelEn: 'ENT (except thyroid/parathyroid)', points: 0.71 },
    { value: 'foregut', label: 'წინა კუჭ-ნაწლავი ან ჰეპატოპანკრეატობილიარული', labelEn: 'Foregut or hepatopancreatobiliary', points: 1.39 },
    { value: 'gallbladder', label: 'ნაღვლის ბუშტი, დანამატი, თირკმელზედა ჯირკვლები, ელენთა', labelEn: 'Gallbladder, appendix, adrenals, spleen', points: 0.59 },
    { value: 'hernia', label: 'გრიჟა (ვენტრალური, inguinal, femoral)', labelEn: 'Hernia (ventral, inguinal, femoral)', points: 0 },
    { value: 'intestinal', label: 'ნაწლავის', labelEn: 'Intestinal', points: 1.14 },
    { value: 'neck', label: 'კისრის (ფარისებრი/პარაფარისებრი)', labelEn: 'Neck (thyroid/parathyroid)', points: 0.18 },
    { value: 'obgyn', label: 'აკუშერული/გინეკოლოგიური', labelEn: 'Obstetric/gynecologic', points: 0.76 },
    { value: 'orthopedic', label: 'ორთოპედიული და არა-სისხლძარღვოვანი კიდურების', labelEn: 'Orthopedic and non-vascular extremity', points: 0.80 },
    { value: 'other-abdominal', label: 'სხვა მუცლის ღრუს', labelEn: 'Other abdominal', points: 1.13 },
    { value: 'peripheral-vascular', label: 'პერიფერიული სისხლძარღვოვანი', labelEn: 'Peripheral vascular', points: 0.86 },
    { value: 'skin', label: 'კანის', labelEn: 'Skin', points: 0.54 },
    { value: 'spine', label: 'ზურგის ტვინის', labelEn: 'Spine', points: 0.21 },
    { value: 'thoracic', label: 'მკერდის ღრუს (არა-ezophageal)', labelEn: 'Non-esophageal thoracic', points: 0.40 },
    { value: 'vein', label: 'ვენის', labelEn: 'Vein', points: -1.09 },
    { value: 'urology', label: 'უროლოგიური', labelEn: 'Urology', points: -0.26 },
  ];

  const calculateRisk = () => {
    if (!age || !functionalStatus || !asaClass || !creatinine || !procedureType) {
      alert('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    const ageNum = parseInt(age);
    const ageValue = ageNum * 0.02;

    const funcStatus = functionalStatusOptions.find(o => o.value === functionalStatus);
    const asa = asaClassOptions.find(o => o.value === asaClass);
    const creat = creatinineOptions.find(o => o.value === creatinine);
    const procedure = procedureTypes.find(o => o.value === procedureType);

    // Calculate x = -5.25 + sum of all values
    const x = -5.25 + ageValue + funcStatus.points + asa.points + creat.points + procedure.points;

    // Calculate risk = e^x / (1 + e^x)
    const expX = Math.exp(x);
    const riskPercent = (expX / (1 + expX)) * 100;

    let riskLevel, riskLevelGe, color, interpretation;

    if (riskPercent < 0.5) {
      riskLevel = 'Very Low Risk';
      riskLevelGe = 'ძალიან დაბალი რისკი';
      color = 'success';
      interpretation = 'ძალიან დაბალი რისკი პერიოპერაციული მიოკარდიუმის ინფარქტის ან გულის გაჩერებისთვის. სტანდარტული პერიოპერაციული მართვა.';
    } else if (riskPercent < 1.0) {
      riskLevel = 'Low Risk';
      riskLevelGe = 'დაბალი რისკი';
      color = 'success';
      interpretation = 'დაბალი რისკი. სტანდარტული პერიოპერაციული მონიტორინგი და მკურნალობა რეკომენდებულია.';
    } else if (riskPercent < 2.0) {
      riskLevel = 'Moderate Risk';
      riskLevelGe = 'ზომიერი რისკი';
      color = 'warning';
      interpretation = 'ზომიერი რისკი. განიხილეთ გაძლიერებული მონიტორინგი და პრევენციული ღონისძიებები. კარდიოლოგის კონსულტაცია შეიძლება საჭირო იყოს.';
    } else if (riskPercent < 5.0) {
      riskLevel = 'High Risk';
      riskLevelGe = 'მაღალი რისკი';
      color = 'error';
      interpretation = 'მაღალი რისკი გულ-სისხლძარღვთა მოვლენებისთვის. კარდიოლოგის პრეოპერაციული კონსულტაცია აუცილებელია. განიხილეთ ICU მონიტორინგი პოსტოპერაციულად.';
    } else {
      riskLevel = 'Very High Risk';
      riskLevelGe = 'ძალიან მაღალი რისკი';
      color = 'error';
      interpretation = 'ძალიან მაღალი რისკი! საჭიროა მრავალდისციპლინური მიდგომა. კარდიოლოგის, ანესთეზიოლოგის და ქირურგის კონსულტაცია. განიხილეთ ალტერნატიული სამკურნალო ვარიანტები.';
    }

    setResult({
      riskPercent: riskPercent.toFixed(2),
      x: x.toFixed(3),
      ageValue: ageValue.toFixed(3),
      riskLevel,
      riskLevelGe,
      color,
      interpretation,
    });
  };

  const handleReset = () => {
    setAge('');
    setFunctionalStatus('');
    setAsaClass('');
    setCreatinine('');
    setProcedureType('');
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
            <FavoriteIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                Gupta Perioperative Risk (MICA)
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                მიოკარდიუმის ინფარქტის ან გულის გაჩერების რისკი ოპერაციის დროს
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Gupta Perioperative Risk Score (MICA)
          </Typography>
          <Typography variant="body2">
            ეს კალკულატორი აფასებს პაციენტის რისკს მიოკარდიუმის ინფარქტის (MI) ან გულის გაჩერების (CA) განვითარებისთვის ოპერაციის დროს ან პოსტოპერაციულად (30 დღის განმავლობაში).
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
                    label="ასაკი (წლები)"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    inputProps={{ min: 0, max: 120 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>ფუნქციური სტატუსი</InputLabel>
                    <Select
                      value={functionalStatus}
                      label="ფუნქციური სტატუსი"
                      onChange={(e) => setFunctionalStatus(e.target.value)}
                    >
                      {functionalStatusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography>{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.labelEn} ({option.points > 0 ? `+${option.points}` : option.points})
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>ASA კლასი</InputLabel>
                    <Select
                      value={asaClass}
                      label="ASA კლასი"
                      onChange={(e) => setAsaClass(e.target.value)}
                    >
                      {asaClassOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography>{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.labelEn} ({option.points})
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>კრეატინინის დონე</InputLabel>
                    <Select
                      value={creatinine}
                      label="კრეატინინის დონე"
                      onChange={(e) => setCreatinine(e.target.value)}
                    >
                      {creatinineOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography>{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.labelEn} ({option.points > 0 ? `+${option.points}` : option.points})
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>ოპერაციის ტიპი</InputLabel>
                    <Select
                      value={procedureType}
                      label="ოპერაციის ტიპი"
                      onChange={(e) => setProcedureType(e.target.value)}
                    >
                      {procedureTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box>
                            <Typography>{option.label}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.labelEn} ({option.points > 0 ? `+${option.points}` : option.points})
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
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
                      onClick={calculateRisk}
                    >
                      რისკის გამოთვლა
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
                    background: `linear-gradient(135deg, ${
                      result.color === 'success' ? '#4CAF50' :
                      result.color === 'warning' ? '#FF9800' : '#F44336'
                    } 0%, ${alpha(
                      result.color === 'success' ? '#4CAF50' :
                      result.color === 'warning' ? '#FF9800' : '#F44336', 0.7
                    )} 100%)`,
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    გულ-სისხლძარღვთა რისკი
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {result.riskPercent}%
                    </Typography>
                    <Typography variant="h6">
                      MI ან CA რისკი 30 დღეში
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Chip
                      label={result.riskLevelGe}
                      sx={{
                        bgcolor: alpha('#fff', 0.2),
                        color: 'white',
                        fontSize: '1rem',
                        py: 2.5,
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Card>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    გამოთვლის დეტალები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ '& > div': { mb: 1 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">x მნიშვნელობა:</Typography>
                      <Typography fontWeight="bold">{result.x}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">ასაკის წვლილი:</Typography>
                      <Typography fontWeight="bold">{result.ageValue}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      ფორმულა: რისკი % = e^x / (1 + e^x)
                    </Typography>
                  </Box>
                </Paper>

                <Alert severity={result.color} sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    კლინიკური რეკომენდაცია:
                  </Typography>
                  <Typography variant="body2">
                    {result.interpretation}
                  </Typography>
                </Alert>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    რეკომენდებული ღონისძიებები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" component="div">
                    {parseFloat(result.riskPercent) < 1.0 && (
                      <>
                        • სტანდარტული პერიოპერაციული მართვა<br />
                        • რუტინული მონიტორინგი<br />
                        • ჩვეულებრივი პოსტოპერაციული მზრუნველობა
                      </>
                    )}
                    {parseFloat(result.riskPercent) >= 1.0 && parseFloat(result.riskPercent) < 2.0 && (
                      <>
                        • განიხილეთ პრეოპერაციული კარდიოლოგიური შეფასება<br />
                        • ბეტა-ბლოკატორების გაგრძელება თუ უკვე იღებს<br />
                        • გაძლიერებული პერიოპერაციული მონიტორინგი<br />
                        • ტროპონინის მონიტორინგი პოსტოპერაციულად
                      </>
                    )}
                    {parseFloat(result.riskPercent) >= 2.0 && (
                      <>
                        • სავალდებულო კარდიოლოგის კონსულტაცია<br />
                        • განიხილეთ სტრეს-ტესტი ან სისხლძარღვების ვიზუალიზაცია<br />
                        • ოპტიმიზაცია ფარმაკოთერაპიისა (ბეტა-ბლოკატორები, სტატინები)<br />
                        • ICU მონიტორინგი პოსტოპერაციულად<br />
                        • გაგრძელებული ტროპონინის მონიტორინგი (48-72 სთ)<br />
                        • განიხილეთ ოპერაციის გადადება თუ რისკი ძალიან მაღალია
                      </>
                    )}
                  </Typography>
                </Paper>
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
                  <FavoriteIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეავსეთ ყველა ველი რისკის გამოსათვლელად
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Clinical Information */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ფორმულა და ინფორმაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              გამოთვლის ფორმულა:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace', mb: 2 }}>
              Cardiac risk, % = e^x / (1 + e^x)
            </Paper>
            <Paper sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              x = −5.25 + (Age × 0.02) + Functional Status + ASA Class + Creatinine + Procedure Type
            </Paper>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Evidence Base (Gupta et al, 2011):
            </Typography>
            <Typography variant="body2">
              • NSQIP მონაცემთა ბაზა - 200,000+ პაციენტი<br />
              • ფაქტორებად გამოყოფილია მინიმალურ ინვაზიური ქირურგია<br />
              • დიფერენცირება ორგანოების სისტემებსა და ოპერაციის ტიპებს შორის<br />
              • გამოთვლის გარეშეა სტრეს-ტესტის შედეგები და ბეტა-ბლოკატორის სტატუსი
            </Typography>
          </Alert>

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              შეზღუდვები:
            </Typography>
            <Typography variant="body2">
              • მხოლოდ რეტროსპექტულად ვალიდირებული<br />
              • შესაძლოა ქვეშეფასებული იყოს მიოკარდიუმის იშემია<br />
              • Gupta Score ირჩევს ნაკლებ პაციენტს მაღალი რისკის სტატუსით RCRI-სთან შედარებით<br />
              • RCRI ზედმეტად აფასებს რისკს დაბალი რისკის პაციენტებში
            </Typography>
          </Alert>

          <Alert severity="success">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              რეკომენდაციები გამოყენებისთვის (Cohn 2018):
            </Typography>
            <Typography variant="body2">
              • გამოიყენეთ Gupta ან ACS NSQIP კალკულატორები დაბალი რისკის პაციენტებისთვის<br />
              • Gupta Score კარგად მუშაობს მინიმალურ ინვაზიურ პროცედურებში<br />
              • უპირატესობა აქვს მოკლე ვადიანი ჰოსპიტალიზაციის შემთხვევებში<br />
              • კომბინირებული გამოყენება RCRI-სთან ამაგრებს პროგნოზირების ზუსტობას
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default GuptaMICACalculator;

