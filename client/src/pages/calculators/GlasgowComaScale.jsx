import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Card,
  Divider,
  Alert,
  Chip,
  alpha,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
  Psychology as PsychologyIcon,
  Visibility as VisibilityIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  PanTool as PanToolIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const GlasgowComaScale = () => {
  const [eyeResponse, setEyeResponse] = useState('');
  const [verbalResponse, setVerbalResponse] = useState('');
  const [motorResponse, setMotorResponse] = useState('');
  const [result, setResult] = useState(null);

  const eyeOptions = [
    { value: 'spontaneous', points: 4, label: 'თვალები იხსნება სპონტანურად', labelEn: 'Eyes open spontaneously' },
    { value: 'verbal', points: 3, label: 'თვალები იხსნება ვერბალურ ბრძანებაზე', labelEn: 'Eye opening to verbal command' },
    { value: 'pain', points: 2, label: 'თვალები იხსნება ტკივილზე', labelEn: 'Eye opening to pain' },
    { value: 'none', points: 1, label: 'თვალები არ იხსნება', labelEn: 'No eye opening' },
    { value: 'nt', points: 0, label: 'შეუძლებელია შეფასება (NT)', labelEn: 'Not testable (NT)', isNT: true },
  ];

  const verbalOptions = [
    { value: 'oriented', points: 5, label: 'ორიენტირებული', labelEn: 'Oriented' },
    { value: 'confused', points: 4, label: 'დაბნეული', labelEn: 'Confused' },
    { value: 'inappropriate', points: 3, label: 'შეუსაბამო სიტყვები', labelEn: 'Inappropriate words' },
    { value: 'incomprehensible', points: 2, label: 'გაუგებარი ბგერები', labelEn: 'Incomprehensible sounds' },
    { value: 'none', points: 1, label: 'ვერბალური პასუხი არ არის', labelEn: 'No verbal response' },
    { value: 'nt', points: 0, label: 'შეუძლებელია შეფასება/ინტუბირებული (NT)', labelEn: 'Not testable/intubated (NT)', isNT: true },
  ];

  const motorOptions = [
    { value: 'obeys', points: 6, label: 'ასრულებს ბრძანებებს', labelEn: 'Obeys commands' },
    { value: 'localizes', points: 5, label: 'ლოკალიზებს ტკივილს', labelEn: 'Localizes pain' },
    { value: 'withdrawal', points: 4, label: 'გაყვანა ტკივილიდან', labelEn: 'Withdrawal from pain' },
    { value: 'flexion', points: 3, label: 'მოხრა ტკივილზე', labelEn: 'Flexion to pain' },
    { value: 'extension', points: 2, label: 'გაშლა ტკივილზე', labelEn: 'Extension to pain' },
    { value: 'none', points: 1, label: 'მოტორული პასუხი არ არის', labelEn: 'No motor response' },
    { value: 'nt', points: 0, label: 'შეუძლებელია შეფასება (NT)', labelEn: 'Not testable (NT)', isNT: true },
  ];

  const calculateGCS = () => {
    if (!eyeResponse || !verbalResponse || !motorResponse) {
      alert('გთხოვთ შეავსოთ ყველა კომპონენტი');
      return;
    }

    const eyeScore = eyeOptions.find(o => o.value === eyeResponse);
    const verbalScore = verbalOptions.find(o => o.value === verbalResponse);
    const motorScore = motorOptions.find(o => o.value === motorResponse);

    const eyePoints = eyeScore.isNT ? 'NT' : eyeScore.points;
    const verbalPoints = verbalScore.isNT ? 'NT' : verbalScore.points;
    const motorPoints = motorScore.isNT ? 'NT' : motorScore.points;

    let totalScore = null;
    let canCalculateTotal = !eyeScore.isNT && !verbalScore.isNT && !motorScore.isNT;

    if (canCalculateTotal) {
      totalScore = eyeScore.points + verbalScore.points + motorScore.points;
    }

    let severity, severityGe, color, interpretation;

    if (totalScore !== null) {
      if (totalScore >= 13) {
        severity = 'Mild TBI';
        severityGe = 'მსუბუქი ტრავმული ტვინის დაზიანება';
        color = 'success';
        interpretation = 'პაციენტი ცნობიერებაშია და საჭიროებს დაკვირვებას. მაღალი ალბათობა კარგი შედეგისა.';
      } else if (totalScore >= 9) {
        severity = 'Moderate TBI';
        severityGe = 'ზომიერი ტრავმული ტვინის დაზიანება';
        color = 'warning';
        interpretation = 'პაციენტს სჭირდება ინტენსიური დაკვირვება და შესაძლოა ნეიროქირურგიული ინტერვენცია. ნევროლოგიური მდგომარეობის რეგულარული შეფასება აუცილებელია.';
      } else if (totalScore < 9 && totalScore >= 3) {
        severity = 'Severe TBI / Coma';
        severityGe = 'მძიმე ტრავმული ტვინის დაზიანება / კომა';
        color = 'error';
        interpretation = 'კრიტიკული მდგომარეობა. საჭიროა გადაუდებელი ინტენსიური თერაპია, შესაძლოა ინტუბაცია და მექანიკური ვენტილაცია. ნეიროქირურგიული კონსულტაცია აუცილებელია.';
      }
    } else {
      severity = 'Unable to calculate';
      severityGe = 'გამოთვლა შეუძლებელია';
      color = 'info';
      interpretation = 'ერთი ან მეტი კომპონენტი არ შეფასებადია (NT). მიუთითეთ მიზეზი (მაგ., ინტუბაცია, სედაცია, ლოკალური დაზიანება).';
    }

    setResult({
      eyePoints,
      verbalPoints,
      motorPoints,
      totalScore,
      severity,
      severityGe,
      color,
      interpretation,
      canCalculateTotal,
    });
  };

  const handleReset = () => {
    setEyeResponse('');
    setVerbalResponse('');
    setMotorResponse('');
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
            <PsychologyIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                Glasgow Coma Scale (GCS)
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ცნობიერების დონის შეფასება
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Glasgow Coma Scale (GCS)
          </Typography>
          <Typography variant="body2">
            GCS არის ნევროლოგიური სკალა მწვავე ტვინის დაზიანების მქონე პაციენტების ცნობიერების დონის შესაფასებლად. შედგება სამი კომპონენტისგან: თვალის, ვერბალური და მოტორული პასუხი.
          </Typography>
        </Alert>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Grid container spacing={3}>
              {/* Eye Response */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <VisibilityIcon color="primary" />
                    <FormLabel component="legend">
                      <Typography variant="h6" fontWeight="bold">
                        თვალის პასუხი (Eye Response)
                      </Typography>
                    </FormLabel>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={eyeResponse} onChange={(e) => setEyeResponse(e.target.value)}>
                      {eyeOptions.map((option) => (
                        <Paper
                          key={option.value}
                          elevation={eyeResponse === option.value ? 2 : 0}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            bgcolor: eyeResponse === option.value ? alpha('#1976d2', 0.05) : 'transparent',
                            border: eyeResponse === option.value ? '2px solid' : '1px solid',
                            borderColor: eyeResponse === option.value ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            cursor: 'pointer',
                          }}
                          onClick={() => setEyeResponse(option.value)}
                        >
                          <FormControlLabel
                            value={option.value}
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body1">{option.label}</Typography>
                                  <Typography variant="caption" color="text.secondary">{option.labelEn}</Typography>
                                </Box>
                                {!option.isNT && (
                                  <Chip label={option.points} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                                )}
                                {option.isNT && (
                                  <Chip label="NT" color="default" size="small" />
                                )}
                              </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>

              {/* Verbal Response */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <RecordVoiceOverIcon color="primary" />
                    <FormLabel component="legend">
                      <Typography variant="h6" fontWeight="bold">
                        ვერბალური პასუხი (Verbal Response)
                      </Typography>
                    </FormLabel>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={verbalResponse} onChange={(e) => setVerbalResponse(e.target.value)}>
                      {verbalOptions.map((option) => (
                        <Paper
                          key={option.value}
                          elevation={verbalResponse === option.value ? 2 : 0}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            bgcolor: verbalResponse === option.value ? alpha('#1976d2', 0.05) : 'transparent',
                            border: verbalResponse === option.value ? '2px solid' : '1px solid',
                            borderColor: verbalResponse === option.value ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            cursor: 'pointer',
                          }}
                          onClick={() => setVerbalResponse(option.value)}
                        >
                          <FormControlLabel
                            value={option.value}
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body1">{option.label}</Typography>
                                  <Typography variant="caption" color="text.secondary">{option.labelEn}</Typography>
                                </Box>
                                {!option.isNT && (
                                  <Chip label={option.points} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                                )}
                                {option.isNT && (
                                  <Chip label="NT" color="default" size="small" />
                                )}
                              </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>

              {/* Motor Response */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PanToolIcon color="primary" />
                    <FormLabel component="legend">
                      <Typography variant="h6" fontWeight="bold">
                        მოტორული პასუხი (Motor Response)
                      </Typography>
                    </FormLabel>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={motorResponse} onChange={(e) => setMotorResponse(e.target.value)}>
                      {motorOptions.map((option) => (
                        <Paper
                          key={option.value}
                          elevation={motorResponse === option.value ? 2 : 0}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            bgcolor: motorResponse === option.value ? alpha('#1976d2', 0.05) : 'transparent',
                            border: motorResponse === option.value ? '2px solid' : '1px solid',
                            borderColor: motorResponse === option.value ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            cursor: 'pointer',
                          }}
                          onClick={() => setMotorResponse(option.value)}
                        >
                          <FormControlLabel
                            value={option.value}
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body1">{option.label}</Typography>
                                  <Typography variant="caption" color="text.secondary">{option.labelEn}</Typography>
                                </Box>
                                {!option.isNT && (
                                  <Chip label={option.points} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                                )}
                                {option.isNT && (
                                  <Chip label="NT" color="default" size="small" />
                                )}
                              </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Paper>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<CalculateIcon />}
                    onClick={calculateGCS}
                  >
                    ქულის გამოთვლა
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
          </Grid>

          <Grid item xs={12} md={5}>
            {result ? (
              <>
                <Card
                  elevation={4}
                  sx={{
                    background: `linear-gradient(135deg, ${
                      result.color === 'success' ? '#4CAF50' :
                      result.color === 'warning' ? '#FF9800' :
                      result.color === 'error' ? '#F44336' : '#2196F3'
                    } 0%, ${alpha(
                      result.color === 'success' ? '#4CAF50' :
                      result.color === 'warning' ? '#FF9800' :
                      result.color === 'error' ? '#F44336' : '#2196F3', 0.7
                    )} 100%)`,
                    color: 'white',
                    p: 4,
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Glasgow Coma Scale
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    {result.canCalculateTotal ? (
                      <>
                        <Typography variant="h2" fontWeight="bold">
                          {result.totalScore}
                        </Typography>
                        <Typography variant="h6">
                          / 15 ქულა
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h4" fontWeight="bold">
                        NT - Not Testable
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      E({result.eyePoints}) V({result.verbalPoints}) M({result.motorPoints})
                    </Typography>
                  </Box>
                </Card>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    სიმძიმის დონე
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Chip
                    label={result.severityGe}
                    color={result.color}
                    sx={{ fontSize: '1rem', py: 2.5, mb: 2, width: '100%' }}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    {result.severity}
                  </Typography>
                  <Typography variant="body2">
                    {result.interpretation}
                  </Typography>
                </Paper>

                <Alert severity={result.color} sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    კლინიკური რეკომენდაციები:
                  </Typography>
                  <Typography variant="body2">
                    {result.canCalculateTotal && result.totalScore >= 13 && 
                      'დაკვირვება და რეგულარული GCS შეფასება. შეამოწმეთ CT თავის ტვინის დაზიანების გამორიცხვა.'}
                    {result.canCalculateTotal && result.totalScore >= 9 && result.totalScore < 13 && 
                      'ინტენსიური დაკვირვება. CT სკანირება აუცილებელია. ნეიროქირურგიული კონსულტაცია. სისხლძარღვებში წვდომა და მონიტორინგი.'}
                    {result.canCalculateTotal && result.totalScore < 9 && 
                      'გადაუდებელი რეანიმაცია! შეაფასეთ სასუნთქი გზები და ჟანგბადის მიწოდება. განიხილეთ ინტუბაცია (GCS <8). CT და ნეიროქირურგიული კონსულტაცია დაუყოვნებლივ.'}
                    {!result.canCalculateTotal && 
                      'დოკუმენტირებული უნდა იქნას NT კომპონენტების მიზეზი. გამოიყენეთ ხელმისაწვდომი კომპონენტები კლინიკური გადაწყვეტილების მისაღებად.'}
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
                  <PsychologyIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    შეაფასეთ ყველა სამი კომპონენტი
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Severity Scale Reference */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            GCS ინტერპრეტაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: alpha('#4CAF50', 0.1), borderLeft: 4, borderColor: '#4CAF50' }}>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  13-15 ქულა
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  მსუბუქი TBI
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  პაციენტი ცნობიერებაშია. საჭიროებს დაკვირვებას. კარგი პროგნოზი.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: alpha('#FF9800', 0.1), borderLeft: 4, borderColor: '#FF9800' }}>
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  9-12 ქულა
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  ზომიერი TBI
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  ინტენსიური დაკვირვება აუცილებელია. შესაძლოა საჭირო იყოს ნეიროქირურგია.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, bgcolor: alpha('#F44336', 0.1), borderLeft: 4, borderColor: '#F44336' }}>
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  3-8 ქულა
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  მძიმე TBI / კომა
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  კრიტიკული მდგომარეობა. გადაუდებელი ინტერვენცია. GCS &lt;8 = ინტუბაცია.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {/* Clinical Information */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            კლინიკური ინფორმაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Not Testable (NT) კომპონენტები:
            </Typography>
            <Typography variant="body2">
              • <strong>თვალი:</strong> ლოკალური დაზიანება და/ან შეშუპება<br />
              • <strong>ვერბალური:</strong> ინტუბაცია, ენობრივი ბარიერი<br />
              • <strong>ყველა კომპონენტი:</strong> სედაცია, პარალიზი, მექანიკური ვენტილაცია
            </Typography>
          </Alert>

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              მნიშვნელოვანი შენიშვნები:
            </Typography>
            <Typography variant="body2">
              • GCS უნდა შეფასდეს რეგულარულად ჰოსპიტალიზაციის განმავლობაში<br />
              • სულ ქულის გამოყენება კარგავს ინფორმაციას - ინდივიდუალური კომპონენტები უფრო ინფორმატიულია<br />
              • იგივე ჯამური ქულა შეიძლება მიუთითებდეს სხვადასხვა პროგნოზზე<br />
              • GCS &lt;8 = "ინტუბაცია" (სასუნთქი გზების დაცვა)<br />
              • სერიული GCS შეფასებები უფრო მნიშვნელოვანია ვიდრე ერთჯერადი ქულა
            </Typography>
          </Alert>

          <Alert severity="success">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Evidence:
            </Typography>
            <Typography variant="body2">
              Modified GCS (15-point) ფართოდ მიღებულია მთელ მსოფლიოში. Reith et al-ის სისტემატურმა მიმოხილვამ (2016) აჩვენა, რომ 85% მაღალი ხარისხის კვლევებში სკალას აქვს მაღალი სანდოობა (kappa &gt;0.6). განათლება და ტრენინგი ზრდის სანდოობას.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </>
  );
};

export default GlasgowComaScale;

