import { useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  alpha,
  Chip,
  Autocomplete,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  LocalPharmacy as LocalPharmacyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * Drug Interaction Checker (GE)
 * - გაფართოებული სია + უფრო დიდი interactions ბაზა
 * - მიმართულებისგან f(reversible) გასაღებები (sorted key)
 * - freeSolo Autocomplete: შეგიძლია ტyped მედიკამენტის დამატებაც
 * - severity map: contraindicated/major → error, moderate → warning, minor → info
 * - ძლიერი დისკლეიმერი (სადემო ინსტრუმენტი, არა სამედიცინო რჩევა)
 */

const SEVERITY_TO_MUI = {
  contraindicated: 'error',
  major: 'error',
  moderate: 'warning',
  minor: 'info',
};

const prettySeverity = (sev) => {
  switch (sev) {
    case 'contraindicated':
      return 'კატეგორიულად აკრძალულია';
    case 'major':
      return 'მაღალი რისკი';
    case 'moderate':
      return 'საშუალო რისკი';
    case 'minor':
      return 'დაბალი რისკი';
    default:
      return 'რისკი';
  }
};

const normalizeName = (s) =>
  String(s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

const keyFor = (a, b) => {
  const [x, y] = [normalizeName(a), normalizeName(b)].sort();
  return `${x}__${y}`;
};

const DrugInteractionChecker = () => {
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [interactions, setInteractions] = useState([]);

  // ძლიერი, მაგრამ მაინც DEMO სია (გაფართოებული)
  const allMedications = useMemo(
    () =>
      [
        // ანალგეტიკები / NSAID / ანტიპირეტიკები
        'ასპირინი',
        'იბუპროფენი',
        'ნაპროქსენი',
        'დიკლოფენაკი',
        'კეტოროლაკი',
        'პარაცეტამოლი',
        // ანტიკოაგულანტები / ანტიპლატელარები
        'ვარფარინი',
        'კლოპიდოგრელი',
        'ტიკაგრელორი',
        // ანტიდეპრესანტები
        'სერტრალინი',
        'ფლუოქსეტინი',
        // MAO ინჰიბიტორები
        'სელეგილინი',
        // ბენზოდიაზეპინები
        'დიაზეპამი',
        'ლორაზეპამი',
        // ოპიოიდები
        'ტრამადოლი',
        'კოდეინი',
        'მორფინი',
        // ანტიდიაბეტური
        'მეტფორმინი',
        // სტატინები
        'სიმვასტატინი',
        'ატორვასტატინი',
        // ანტაციიდები / PPI
        'ომეპრაზოლი',
        // ანტიბიოტიკები
        'ამოქსიცილინი',
        'ერითრომიცინი',
        'კლარითრომიცინი',
        'ტრიმეტოპრიმი/სულფამეთოქსაზოლი',
        // ანტიფუნგალები
        'ფლუკონაზოლი',
        'კეტოკონაზოლი',
        // ანტიჰიპერტენზიული
        'ენალაპრილი',
        'ლოზარტანი',
        'სპირონოლაქტონი',
        'კალიუმის პრეპარატები',
        // „არაცხ药“/ფაქტორები
        'ალკოჰოლი',
        'გრეიფრუტის წვენი',
        'სენტ ჯონს უორსი',
      ].sort(),
    []
  );

  /**
   * Interaction Database (DEMO)
   * გასაღები: keyFor('drugA','drugB')
   * severity: contraindicated | major | moderate | minor
   */
  const interactionDatabase = useMemo(() => {
    const db = {};

    const add = (a, b, severity, description, recommendation) => {
      db[keyFor(a, b)] = { a, b, severity, description, recommendation };
    };

    // NSAID + NSAID
    add(
      'ასპირინი',
      'იბუპროფენი',
      'moderate',
      'ორივე არის NSAID — კუჭ-ნაწლავის სისხლდენისა და თირკმლის დაზიანების რისკი იზრდება.',
      'თავიდან აიცილეთ თანდაყოლილი მიღება; თუ აუცილებელია, დაიცავით დროითი ინტერვალი და კონსულტაცია ფარმაცევტთან.'
    );
    add(
      'ასპირინი',
      'ნაპროქსენი',
      'moderate',
      'NSAID-ების კომბინაცია ზრდის GI და თირკმლის რისკებს.',
      'სჯობს მონოთერაპია მინიმალურ ეფექტურ დოზაზე; თუ საჭიროა, დროითი ინტერვალით და ექიმის ზედამხედველობით.'
    );

    // Warfarin + antiplatelets / many antibiotics / azoles
    add(
      'ვარფარინი',
      'ასპირინი',
      'major',
      'ორი აგენტი ამცირებს შედედებას — სერიოზული სისხლდენის რისკი იზრდება.',
      'გამოიყენეთ მხოლოდ მკაცრი სამედიცინო კონტროლით; საჭიროა INR მონიტორინგი.'
    );
    add(
      'ვარფარინი',
      'იბუპროფენი',
      'major',
      'NSAID-ები ზრდის GI სისხლდენის რისკს ვარფარინთან ერთად.',
      'გამოიყენეთ ალტერნატივა (მაგ. პარაცეტამოლი) ან იმოქმედეთ ექიმის დავალებით; მონიტორინგი აუცილებელია.'
    );
    add(
      'ვარფარინი',
      'პარაცეტამოლი',
      'moderate',
      'ხანგრძლივი/მაღალი დოზებით პარაცეტამოლმა შეიძლება გაზარდოს INR.',
      'გამოიყენეთ ყველაზე დაბალი ეფექტური დოზა; მონიტორინგი თუ გამოყენება ხანგრძლივია.'
    );
    add(
      'ვარფარინი',
      'ტრიმეტოპრიმი/სულფამეთოქსაზოლი',
      'major',
      'TMP/SMX მნიშვნელოვნად ზრდის ვარფარინის ეფექტს (INR↑) — სისხლდენის რისკი.',
      'თავიდან აიცილეთ ან მჭიდრო INR მონიტორინგი/დოზის კორექცია.'
    );
    add(
      'ვარფარინი',
      'ფლუკონაზოლი',
      'major',
      'ფლუკონაზოლი (CYP ინჰიბიცია) ზრდის ვარფარინის დოზის ეფექტს (INR↑).',
      'თუ აუცილებელია, მჭიდრო INR მონიტორინგი და დოზის კორექცია.'
    );
    add(
      'ვარფარინი',
      'კლარითრომიცინი',
      'major',
      'მაკროლიდები ზრდიან ვარფარინის ეფექტს — სისხლდენის რისკი.',
      'კონსულტაცია ექიმთან; INR მონიტორინგი.'
    );
    add(
      'ვარფარინი',
      'ამოქსიცილინი',
      'moderate',
      'ზოგჯერ აღწერილია INR ზრდა; კლინიკური მნიშვნელობა ინდივიდუალურია.',
      'ყურადღება მიაქციეთ სისხლდენის ნიშნებს; საჭიროებისამებრ INR შემოწმება.'

    );

    // PPI + Clopidogrel
    add(
      'ომეპრაზოლი',
      'კლოპიდოგრელი',
      'moderate',
      'ომეპრაზოლი ამცირებს კლოპიდოგრელის აქტივაციას (CYP2C19) — ანტიპლატელარული ეფექტი შეიძლება დასუსტდეს.',
      'განიხილეთ ალტერნატიული მჟავის-სუპრესია (მაგ. პანტოპრაზოლი) ან კარდიოლოგის რეკომენდაცია.'
    );

    // Statins + CYP inhibitors / grapefruit
    ['კლარითრომიცინი', 'ერითრომიცინი', 'ფლუკონაზოლი', 'კეტოკონაზოლი'].forEach((x) =>
      add(
        'სიმვასტატინი',
        x,
        'major',
        'სიმვასტატინის კონცენტრაცია იზრდება (CYP3A4 ინჰიბიცია) — მიოპათიის/რაბდომიოლიზის რისკი.',
        'თავიდან აიცილეთ კომბინაცია ან შეცვალეთ სტატინი (მაგ. პრავასტატინი) / გამოიყენეთ ალტერნ. ანტიბიოტიკი.'
      )
    );
    add(
      'სიმვასტატინი',
      'გრეიფრუტის წვენი',
      'major',
      'გრეიფრუტი ინჰიბირებს CYP3A4-ს ნაწლავში — სიმვასტატინის დონე იზრდება.',
      'თავიდან აიცილეთ რეგულარული მოხმარება სიმვასტატინთან; თუ მაინც, მინიმალიზაცია და ექიმის კონტროლი.'
    );
    add(
      'ატორჵასტატინი',
      'გრეიფრუტის წვენი',
      'moderate',
      'შესაძლებელია ექპოზიციის მატება; რისკი სიმვასტატინზე ნაკლები, მაგრამ მაინც არსებობს.',
      'ზღვრული რაოდენობა ან თავიდან არიდება; სიმპტომების (კუნთის ტკივილი) მონიტორინგი.'
    );

    // Benzos + alcohol / CYP inhibitors
    add(
      'დიაზეპამი',
      'ალკოჰოლი',
      'major',
      'ცენტრალური დეპრესია ძლიერდება — სედაცია/რესპირატორული დეპრესია.',
      'თავიდან აიცილეთ ერთდროული გამოყენება.'
    );
    ['ერითრომიცინი', 'კლარითრომიცინი', 'კეტოკონაზოლი', 'ფლუკონაზოლი'].forEach((x) =>
      add(
        'დიაზეპამი',
        x,
        'moderate',
        'მეტაბოლიზმი ინჰიბირებულია — სედაცია/შემანელებელი ეფექტი ძლიერდება.',
        'დოზის გადახედვა/მონიტორინგი; ოფციად სხვა ანტიბიოტიკი/ანტიფუნგალი.'
      )
    );

    // Metformin + alcohol
    add(
      'მეტფორმინი',
      'ალკოჰოლი',
      'major',
      'ალკოჰოლი ზრდის ლაქტატაციდოზის რისკს მეტფორმინის ფონზე.',
      'თავიდან აიცილეთ ან მინიმუმამდე დაიყვანეთ; სიმპტომების მიმართ სიფრთხილე.'
    );

    // ACEi / ARB + potassium / K-sparing diuretic
    add(
      'ენალაპრილი',
      'სპირონოლაქტონი',
      'major',
      'ჰიპერკალიემიის რისკი იზრდება (კრიტიკული შეიძლება გახდეს თირკმლის დისფუნქციაში).',
      'კალიუმის მონიტორინგი, დოზის კორექცია ან თავიდან არიდება.'
    );
    add(
      'ენალაპრილი',
      'კალიუმის პრეპარატები',
      'moderate',
      'შესაძლებელია კალიუმის დონის მატება.',
      'კალიუმის მონიტორინგი/დოზის გადახედვა.'
    );
    add(
      'ლოზარტანი',
      'სპირონოლაქტონი',
      'major',
      'ARB + K-sparing — ჰიპერკალიემიის რისკი.',
      'კალიუმის მონიტორინგი ან ალტერნატივა.'
    );

    // SSRIs + NSAIDs (GI bleed), SSRIs + Tramadol (serotonin)
    ;['სერტრალინი', 'ფლუოქსეტინი'].forEach((ssri) => {
      ['ასპირინი', 'იბუპროფენი', 'ნაპროქსენი', 'დიკლოფენაკი', 'კეტოროლაკი'].forEach((nsaid) =>
        add(
          ssri,
          nsaid,
          'moderate',
          'SSRI + NSAID ზრდის GI სისხლდენის რისკს.',
          'განიხილეთ PPI პროფილაქსისი/ალტერნატივა; ყურადღება მიაქციეთ სისხლდენის ნიშნებს.'
        )
      );
      add(
        ssri,
        'ტრამადოლი',
        'major',
        'სეროტონინის სინდრომის რისკი (აღგზნებადობა, ჰიპერტემია, კლონუსი).',
        'თავიდან აიცილეთ კომბინაცია ან მჭიდრო კლინიკური მონიტორინგი.'
      );
      add(
        ssri,
        'სელეგილინი',
        'contraindicated',
        'SSRI + MAOI — მაღალი რისკი სეროტონინის სინდრომისა.',
        'კომბინაცია აკრძალულია. საჭიროა საკმარისი „გაფხიზლების პერიოდი“ პრეპარატებს შორის ექიმის მითითებით.'
      );
    });

    // Tramadol + strong CYP2D6 inhibitors (reduced efficacy / toxicity pattern)
    add(
      'კოდეინი',
      'ფლუოქსეტინი',
      'moderate',
      'CYP2D6 ინჰიბიცია ამცირებს კოდეინის მორფინად აქტივაციას — ტკივილის კონტროლი შესაძლოა დასუსტდეს.',
      'განიხილეთ ალტერნატიული ანალგეზია.'
    );

    // Aspirin timing with Naproxen (antiplatelet interference)
    add(
      'ასპირინი',
      'ნაპროქსენი',
      'moderate',
      'ნაპროქსენმა შეიძლება შეასუსტოს ასპირინის ანტიპლატელარული ეფექტი, თუ დროებით ახლოს არის მიღება.',
      'თუ ორივე აუცილებელია: მიიღეთ ასპირინი ჯერ, შემდეგ რამდენიმე საათში ნაპროქსენი; კონსულტაცია ექიმთან.'
    );

    // St John’s Wort — CYP3A4 inducer (many ↓ levels), with clopidogrel mixed data — keep simple major examples
    add(
      'სენტ ჯონს უორსი',
      'დიაზეპამი',
      'moderate',
      'შეიძლება დააჩქაროს მეტაბოლიზმი (ეფექტი დასუსტდეს) ან იმოქმედოს არაპროგნოზირებად.',
      'თავიდან აიცილეთ თვითნებური კომბინაცია; ექიმის კონსულტაცია.'
    );
    add(
      'სენტ ჯონს უორსი',
      'ატორჵასტატინი',
      'moderate',
      'ინდუქციის გამო შეიძლება შემცირდეს ატორვასტატინის დონე (ეფექტი დასუსტდეს).',
      'განიხილეთ ალტერნატივა/დოზის კორექცია ექიმთან.'
    );

    // Alcohol with opioids
    add(
      'ალკოჰოლი',
      'მორფინი',
      'major',
      'სედაცია/რესპირატორული დეპრესია იზრდება.',
      'აკრძალეთ კომბინაცია.'
    );

    return db;
  }, []);

  const checkInteractions = () => {
    if (selectedDrugs.length < 2) {
      alert('გთხოვთ აირჩიოთ მინიმუმ 2 მედიკამენტი');
      return;
    }

    const found = [];
    // ყველა წყვილი
    for (let i = 0; i < selectedDrugs.length; i++) {
      for (let j = i + 1; j < selectedDrugs.length; j++) {
        const a = selectedDrugs[i];
        const b = selectedDrugs[j];
        const k = keyFor(a, b);
        if (interactionDatabase[k]) {
          const { severity, description, recommendation } = interactionDatabase[k];
          found.push({
            drugs: [a, b],
            severity,
            description,
            recommendation,
          });
        }
      }
    }

    // დავალაგოთ ყველაზე სერიოზული ზემოთ
    const rank = { contraindicated: 3, major: 2, moderate: 1, minor: 0 };
    found.sort((x, y) => (rank[y.severity] ?? 0) - (rank[x.severity] ?? 0));
    setInteractions(found);
  };

  // UI helpers
  const muiSeverity = (sev) => SEVERITY_TO_MUI[sev] || 'info';

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
              '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.1) },
            }}
          >
            ← უკან კალკულატორებზე
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LocalPharmacyIcon sx={{ fontSize: 50 }} />
            <Box>
              <Typography variant="h3" fontWeight="bold">
                მედიკამენტების ურთიერთქმედების შემოწმება
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                შეამოწმეთ მედიკამენტთა ურთიერთქმედების შესაძლო რისკები
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
            ეს არის სადემონსტრაციო ინსტრუმენტი შეზღუდული, ხელით შედგენილი მონაცემთა ბაზით. იგი არ
            შეიძლება გამოყენებულ იქნას სამედიცინო გადაწყვეტილებების მისაღებად. სრული, მიმდინარე
            ინფორმაციისთვის გამოიყენეთ პროფესიონალური ურთიერთქმედების მონაცემთა ბაზები და მიმართეთ
            თქვენს ექიმს/ფარმაცევტს.
          </Typography>
        </Alert>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            აირჩიეთ მედიკამენტები
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            აირჩიეთ მინიმუმ 2 მედიკამენტი ურთიერთქმედების შესამოწმებლად
          </Typography>

          <Autocomplete
            multiple
            freeSolo
            autoSelect
            options={allMedications}
            filterSelectedOptions
            value={selectedDrugs}
            onChange={(_, newValue) => {
              // მოვაშოროთ ცარიელები/დუბლიკატები case-insensitiveად
              const seen = new Set();
              const cleaned = [];
              for (const v of newValue) {
                const n = normalizeName(v);
                if (!n) continue;
                if (!seen.has(n)) {
                  seen.add(n);
                  // შევინარჩუნოთ იუზერის შეყვანილი ფორმა
                  cleaned.push(v);
                }
              }
              setSelectedDrugs(cleaned);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="მედიკამენტები ან ფაქტორები (მაგ. ალკოჰოლი, გრეიფრუტის წვენი)"
                placeholder="აირჩიეთ ან ჩაწერეთ მედიკამენტები"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} color="primary" />
              ))
            }
            sx={{ mb: 3 }}
          />

          <Tooltip
            title={
              selectedDrugs.length < 2
                ? 'აირჩიეთ მინიმუმ 2 ელემენტი'
                : 'შეამოწმე შერჩეული წყვილები'
            }
          >
            <span style={{ display: 'block' }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<WarningIcon />}
                onClick={checkInteractions}
                disabled={selectedDrugs.length < 2}
              >
                ურთიერთქმედების შემოწმება
              </Button>
            </span>
          </Tooltip>
        </Paper>

        {interactions.length > 0 ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom color="error">
              ნაპოვნია {interactions.length} ურთიერთქმედება
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <List>
              {interactions.map((interaction, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderLeft: 4,
                    borderColor:
                      muiSeverity(interaction.severity) === 'error'
                        ? 'error.main'
                        : muiSeverity(interaction.severity) === 'warning'
                        ? 'warning.main'
                        : 'info.main',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={prettySeverity(interaction.severity)}
                      color={muiSeverity(interaction.severity)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      {interaction.drugs.join(' + ')}
                    </Typography>
                  </Box>

                  <Typography variant="body2" paragraph>
                    <strong>აღწერა:</strong> {interaction.description}
                  </Typography>

                  <Alert severity={muiSeverity(interaction.severity)}>
                    <Typography variant="body2">
                      <strong>რეკომენდაცია:</strong> {interaction.recommendation}
                    </Typography>
                  </Alert>
                </Paper>
              ))}
            </List>
          </Paper>
        ) : selectedDrugs.length >= 2 ? (
          <Alert severity="success" sx={{ mb: 4 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              ურთიერთქმედება არ ნაპოვნია
            </Typography>
            <Typography variant="body2">
              შერჩეულ ელემენტებს შორის ცნობილი ურთიერთქმედებები არ მოიძებნა ჩვენს DEMO ბაზაში.
              ეს არ გამორიცხავს რეალურ რისკებს. მიმართეთ ექიმს/ფარმაცევტს და გამოიყენეთ
              ავტორიტეტული მონაცემთა ბაზები.
            </Typography>
          </Alert>
        ) : null}

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            რჩევები უსაფრთხო მედიკამენტების მიღებისთვის
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <List>
            <ListItem>
              <ListItemText
                primary="1. ინფორმირებული იყავით"
                secondary="ყოველთვის აცნობეთ ექიმს/ფარმაცევტს ყველა მედიკამენტის, ვიტამინისა და დანამატის შესახებ, რომელსაც იღებთ."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. შეინახეთ სია"
                secondary="აწარმოეთ სრული სია (სახელწოდება, დოზა, სიხშირე) და განაახლეთ ცვლილებებისას."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. წაიკითხეთ ინსტრუქცია"
                secondary="ყოველთვის გაეცანით ინსტრუქციას და დაიცავით რეკომენდებული დოზა/რეჟიმი."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. თავი არიდეთ თვითმკურნალობას"
                secondary="ახალ პრეპარატს ნუ დაიწყებთ ექიმთან კონსულტაციის გარეშე, მით უმეტეს თუ სხვა წამლებსაც იღებთ."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="5. სიფრთხილე ალკოჰოლთან/საკვებთან"
                secondary="ბევრ წამალს აქვს ურთიერთქმედება ალკოჰოლთან ან საკვებთან (მაგ. გრეიფრუტი)."
              />
            </ListItem>
          </List>
        </Paper>

        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>შენიშვნა:</strong> ეს ინსტრუმენტი მოიცავს მხოლოდ ნაწილობრივ, დემონსტრაციულ
            ინფორმაციას. პროფესიონალური კონსულტაციისთვის მიმართეთ:
            <br />• ფარმაცევტს ნებისმიერ აფთიაქში
            <br />• თქვენს მკურნალ ექიმს
            <br />• ავტორიტეტულ მონაცემთა ბაზებს (Micromedex, Lexicomp, BNF და სხვ.)
          </Typography>
        </Alert>
      </Container>
    </>
  );
};

export default DrugInteractionChecker;
