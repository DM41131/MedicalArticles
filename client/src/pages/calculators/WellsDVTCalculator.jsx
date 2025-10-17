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
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  RestartAlt as RestartAltIcon,
  Healing as HealingIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const WellsDVTCalculator = () => {
  const [criteria, setCriteria] = useState({
    activeCancer: false,
    bedridden: false,
    calfSwelling: false,
    collateralVeins: false,
    entireLegSwollen: false,
    localizedTenderness: false,
    pittingEdema: false,
    paralysis: false,
    previousDVT: false,
    alternativeDiagnosis: false,
  });

  const [result, setResult] = useState(null);

  const criteriaList = [
    {
      key: 'activeCancer',
      label: 'აქტიური კიბო',
      labelEn: 'Active cancer',
      description: 'მკურნალობა ან პალიაციური მკურნალობა ბოლო 6 თვის განმავლობაში',
      points: 1,
    },
    {
      key: 'bedridden',
      label: 'უძრაობა ან ოპერაცია',
      labelEn: 'Bedridden or major surgery',
      description: 'საწოლში >3 დღე ან დიდი ოპერაცია ბოლო 12 კვირაში',
      points: 1,
    },
    {
      key: 'calfSwelling',
      label: 'კანჭის შეშუპება',
      labelEn: 'Calf swelling',
      description: '>3 სმ მეორე ფეხთან შედარებით (გაზომილი 10 სმ წვივის ბუგრის ქვემოთ)',
      points: 1,
    },
    {
      key: 'collateralVeins',
      label: 'კოლატერალური ვენები',
      labelEn: 'Collateral superficial veins',
      description: 'არავარიკოზული ზედაპირული ვენები',
      points: 1,
    },
    {
      key: 'entireLegSwollen',
      label: 'მთელი ფეხის შეშუპება',
      labelEn: 'Entire leg swollen',
      description: 'მთელი ფეხი შეშუპებული',
      points: 1,
    },
    {
      key: 'localizedTenderness',
      label: 'ლოკალიზებული მგრძნობელობა',
      labelEn: 'Localized tenderness',
      description: 'ღრმა ვენური სისტემის გასწვრივ',
      points: 1,
    },
    {
      key: 'pittingEdema',
      label: 'ჩაჭდომადი შეშუპება',
      labelEn: 'Pitting edema',
      description: 'მხოლოდ სიმპტომური ფეხისთვის',
      points: 1,
    },
    {
      key: 'paralysis',
      label: 'დამბლა ან იმობილიზაცია',
      labelEn: 'Paralysis or immobilization',
      description: 'დამბლა, პარეზი ან ფეხის ახლახან გაკეთებული გიპსი',
      points: 1,
    },
    {
      key: 'previousDVT',
      label: 'წინა DVT',
      labelEn: 'Previously documented DVT',
      description: 'ადრე დადასტურებული ღრმა ვენური თრომბოზი',
      points: 1,
    },
    {
      key: 'alternativeDiagnosis',
      label: 'ალტერნატიული დიაგნოზი',
      labelEn: 'Alternative diagnosis',
      description: 'DVT-ს ალტერნატიული დიაგნოზი ისეთივე ან უფრო სავარაუდო',
      points: -2,
    },
  ];

  const handleChange = (key) => {
    setCriteria({
      ...criteria,
      [key]: !criteria[key],
    });
  };

  const calculateScore = () => {
    let score = 0;
    criteriaList.forEach((item) => {
      if (criteria[item.key]) {
        score += item.points;
      }
    });

    let riskLevel, riskLevelGe, prevalence, color, recommendation;

    if (score <= 0) {
      riskLevel = 'Low/Unlikely';
      riskLevelGe = 'დაბალი რისკი';
      prevalence = '5%';
      color = 'success';
      recommendation = 'DVT-ს ალბათობა დაბალია. D-dimer ტესტი შეიძლება საკმარისი იყოს. უარყოფითი d-dimer გამორიცხავს DVT-ს.';
    } else if (score >= 1 && score <= 2) {
      riskLevel = 'Moderate';
      riskLevelGe = 'ზომიერი რისკი';
      prevalence = '17%';
      color = 'warning';
      recommendation = 'ზომიერი რისკი. რეკომენდებულია d-dimer ტესტი. თუ დადებითია, საჭიროა კომპრესიული ულტრაბგერა.';
    } else {
      riskLevel = 'High/Likely';
      riskLevelGe = 'მაღალი რისკი';
      prevalence = '17-53%';
      color = 'error';
      recommendation = 'მაღალი რისკი DVT-სთვის. რეკომენდებულია კომპრესიული ულტრაბგერა (CUS). D-dimer ტესტი არ არის საჭირო.';
    }

    setResult({
      score,
      riskLevel,
      riskLevelGe,
      prevalence,
      color,
      recommendation,
    });
  };

  const handleReset = () => {
    setCriteria({
      activeCancer: false,
      bedridden: false,
      calfSwelling: false,
      collateralVeins: false,
      entireLegSwollen: false,
      localizedTenderness: false,
      pittingEdema: false,
      paralysis: false,
      previousDVT: false,
      alternativeDiagnosis: false,
    });
    setResult(null);
  };

  const riskGroups = [
    { score: '≤0', riskGe: 'დაბალი/სავარაუდო არაა', riskEn: 'Low/Unlikely', prevalence: '5%' },
    { score: '1-2', riskGe: 'ზომიერი', riskEn: 'Moderate', prevalence: '17%' },
    { score: '≥3', riskGe: 'მაღალი/სავარაუდოა', riskEn: 'High/Likely', prevalence: '17-53%' },
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
            <HealingIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                Wells' Criteria for DVT
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                ღრმა ვენური თრომბოზის რისკის შეფასება
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Wells' Criteria (2003)
          </Typography>
          <Typography variant="body2">
            ეს კრიტერიუმები გამოიყენება სიმპტომური ამბულატორიული პაციენტების DVT რისკის სტრატიფიკაციისთვის. დადასტურებული ულტრაბგერით და d-dimer ტესტირებით.
          </Typography>
        </Alert>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                კლინიკური კრიტერიუმები
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                მონიშნეთ ყველა შესაბამისი კრიტერიუმი
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {criteriaList.map((item) => (
                  <Grid item xs={12} key={item.key}>
                    <Paper
                      elevation={criteria[item.key] ? 3 : 1}
                      sx={{
                        p: 2,
                        bgcolor: criteria[item.key] ? alpha('#1976d2', 0.05) : 'background.paper',
                        border: criteria[item.key] ? '2px solid' : '1px solid',
                        borderColor: criteria[item.key] ? 'primary.main' : 'divider',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: alpha('#1976d2', 0.02),
                        },
                      }}
                      onClick={() => handleChange(item.key)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={criteria[item.key]}
                              onChange={() => handleChange(item.key)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {item.label}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {item.labelEn}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {item.description}
                              </Typography>
                            </Box>
                          }
                          sx={{ m: 0, width: '100%' }}
                        />
                        <Chip
                          label={item.points > 0 ? `+${item.points}` : item.points}
                          color={item.points > 0 ? 'primary' : 'error'}
                          size="small"
                          sx={{ ml: 2, fontWeight: 'bold' }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<CalculateIcon />}
                  onClick={calculateScore}
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
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
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
                    Wells' ქულა
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h2" fontWeight="bold">
                      {result.score}
                    </Typography>
                    <Typography variant="h6">
                      ქულა
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
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      DVT-ს გავრცელება: {result.prevalence}
                    </Typography>
                  </Box>
                </Card>

                <Alert severity={result.color} sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    რეკომენდაცია:
                  </Typography>
                  <Typography variant="body2">
                    {result.recommendation}
                  </Typography>
                </Alert>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    შემდგომი ნაბიჯები
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" component="div">
                    {result.score <= 0 && (
                      <>
                        <strong>დაბალი რისკი:</strong><br />
                        • D-dimer ტესტი<br />
                        • თუ უარყოფითია: DVT გამორიცხულია<br />
                        • თუ დადებითია: კომპრესიული ულტრაბგერა
                      </>
                    )}
                    {result.score >= 1 && result.score <= 2 && (
                      <>
                        <strong>ზომიერი რისკი:</strong><br />
                        • D-dimer ტესტი<br />
                        • თუ დადებითია: კომპრესიული ულტრაბგერა<br />
                        • განიხილეთ ანტიკოაგულანტური თერაპია
                      </>
                    )}
                    {result.score >= 3 && (
                      <>
                        <strong>მაღალი რისკი:</strong><br />
                        • კომპრესიული ულტრაბგერა (CUS)<br />
                        • D-dimer არ არის საჭირო<br />
                        • განიხილეთ ანტიკოაგულაცია დაუყოვნებლივ<br />
                        • გადაუდებელი ვასკულარული ქირურგის კონსულტაცია
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
                  <HealingIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    მონიშნეთ კრიტერიუმები და გამოთვალეთ ქულა
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* Risk Stratification Table */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            რისკის სტრატიფიკაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Wells' ქულა</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>რისკის ჯგუფი</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>DVT-ს გავრცელება</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riskGroups.map((row, index) => (
                  <TableRow key={index} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{row.score}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{row.riskGe}</Typography>
                      <Typography variant="caption" color="text.secondary">{row.riskEn}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.prevalence}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Evidence and Information */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            მტკიცებულებები და ინფორმაცია
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Wells' კრიტერიუმების წარმოშობა:
            </Typography>
            <Typography variant="body2">
              Wells-ის კრიტერიუმები შემუშავდა რიგი კვლევების საფუძველზე (Wells 1995, 1997, 2003) სიმპტომური ამბულატორიული პაციენტების DVT რისკის სტრატიფიკაციის მიზნით. კლინიკური დიაგნოსტიკა არაზუსტად ითვლებოდა, რაც იწვევდა დამადასტურებელი ვიზუალიზაციის ზედმეტ გამოყენებას.
            </Typography>
          </Alert>

          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              ვალიდაცია (Wells 2003):
            </Typography>
            <Typography variant="body2">
              • 1,096 ამბულატორიული პაციენტი DVT-ს ეჭვით<br />
              • D-dimer-ის უარყოფითი პროგნოზული მნიშვნელობა: 96.1%<br />
              • "სავარაუდოა" ჯგუფში DVT-ს სიხშირე: 28.7%<br />
              • "არასავარაუდოა" ჯგუფში DVT-ს სიხშირე: 5.7%
            </Typography>
          </Alert>

          <Alert severity="warning">
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              მნიშვნელოვანი შენიშვნები:
            </Typography>
            <Typography variant="body2">
              • ეს არის კლინიკური გადაწყვეტილების ინსტრუმენტი, არა დიაგნოსტიკური ტესტი<br />
              • უნდა გამოყენებულ იქნას სიმპტომურ ამბულატორიულ პაციენტებში<br />
              • არ არის ვალიდირებული ჰოსპიტალიზებულ პაციენტებში<br />
              • D-dimer ტესტი და/ან ულტრაბგერა აუცილებელია დიაგნოზის დასადასტურებლად<br />
              • კლინიკური გადაწყვეტილება ყოველთვის უნდა იქნას მიღებული კვალიფიციური ექიმის მიერ
            </Typography>
          </Alert>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              სისტემატური მიმოხილვა (Wells 2006):
            </Typography>
            <Typography variant="body2">
              14 კვლევა 8,239 პაციენტით დაადასტურა Wells' ქულის გამოყენებას D-dimer ტესტთან ერთად DVT-ს რისკის პროგნოზირებაში. ეს მიდგომა მხარდაჭერილია American College of Chest Physicians-ის მიერ DVT-ს შეფასების გაიდლაინებში.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default WellsDVTCalculator;

