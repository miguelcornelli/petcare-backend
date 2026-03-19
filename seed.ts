import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed...\n')

  // Limpar dados existentes (exceto o usuário miguel@petcare.com)
  await prisma.accessLog.deleteMany()
  await prisma.accessRequest.deleteMany()
  await prisma.allergy.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.consult.deleteMany()
  await prisma.antiParasite.deleteMany()
  await prisma.vaccine.deleteMany()
  await prisma.petWeight.deleteMany()
  await prisma.pet.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany({ where: { email: { not: 'miguel@petcare.com' } } })

  const hash = (p: string) => bcrypt.hash(p, 12)

  // ── USUÁRIOS ──────────────────────────────────────────────
  console.log('👤 Criando usuários...')

  const tutor = await prisma.user.create({
    data: {
      name: 'Ana Lima',
      email: 'ana@petcare.com',
      password: await hash('123456'),
      role: 'TUTOR',
      cpf: '98765432100',
      phone: '11999990001',
    },
  })

  const vet = await prisma.user.create({
    data: {
      name: 'Dr. Carlos Mendes',
      email: 'carlos@petcare.com',
      password: await hash('123456'),
      role: 'VET',
      crmv: 'CRMV-SP 54321',
      phone: '11999990002',
    },
  })

  const clinic = await prisma.user.create({
    data: {
      name: 'PetHotel Feliz',
      email: 'hotel@petcare.com',
      password: await hash('123456'),
      role: 'CLINIC',
      phone: '11999990003',
    },
  })

  console.log(`  ✓ Tutor:  ${tutor.email}`)
  console.log(`  ✓ Vet:    ${vet.email}`)
  console.log(`  ✓ Clinic: ${clinic.email}`)

  // ── PETS ──────────────────────────────────────────────────
  console.log('\n🐾 Criando pets...')

  const bolinha = await prisma.pet.create({
    data: {
      tutorId: tutor.id,
      name: 'Bolinha',
      species: 'Cão',
      breed: 'Golden Retriever',
      gender: 'MALE',
      birthDate: new Date('2020-05-10'),
      color: 'Dourado',
      microchip: 'BR123456789',
    },
  })

  const mimi = await prisma.pet.create({
    data: {
      tutorId: tutor.id,
      name: 'Mimi',
      species: 'Gato',
      breed: 'Persa',
      gender: 'FEMALE',
      birthDate: new Date('2021-08-22'),
      color: 'Branca',
    },
  })

  console.log(`  ✓ ${bolinha.name} (${bolinha.species}) id: ${bolinha.id}`)
  console.log(`  ✓ ${mimi.name} (${mimi.species}) id: ${mimi.id}`)

  // ── PESOS ─────────────────────────────────────────────────
  console.log('\n⚖️  Registrando pesos...')

  await prisma.petWeight.createMany({
    data: [
      { petId: bolinha.id, weight: 28.5, date: new Date('2026-01-10') },
      { petId: bolinha.id, weight: 29.2, date: new Date('2026-02-15') },
      { petId: bolinha.id, weight: 30.1, date: new Date('2026-03-10') },
      { petId: mimi.id,    weight: 4.2,  date: new Date('2026-01-20') },
      { petId: mimi.id,    weight: 4.5,  date: new Date('2026-03-05') },
    ],
  })
  console.log('  ✓ Bolinha: 3 registros | Mimi: 2 registros')

  // ── VACINAS (registradas pelo veterinário) ────────────────
  console.log('\n💉 Registrando vacinas (pelo veterinário)...')

  const vaccines = await prisma.vaccine.createMany({
    data: [
      { petId: bolinha.id, vetId: vet.id, name: 'V10',            appliedAt: new Date('2025-06-01'), expiresAt: new Date('2026-06-01'), lot: 'LOT-2025-001', manufacturer: 'Zoetis' },
      { petId: bolinha.id, vetId: vet.id, name: 'Antirrábica',    appliedAt: new Date('2025-06-01'), expiresAt: new Date('2026-06-01'), lot: 'LOT-2025-002', manufacturer: 'Merial' },
      { petId: bolinha.id, vetId: vet.id, name: 'Gripe Canina',   appliedAt: new Date('2025-04-01'), expiresAt: new Date('2026-04-05'), lot: 'LOT-2025-005', manufacturer: 'Boehringer' },
      { petId: mimi.id,    vetId: vet.id, name: 'Quádrupla Felina', appliedAt: new Date('2025-08-10'), expiresAt: new Date('2026-08-10'), lot: 'LOT-2025-003', manufacturer: 'MSD' },
      { petId: mimi.id,    vetId: vet.id, name: 'Antirrábica Felina', appliedAt: new Date('2025-08-10'), expiresAt: new Date('2026-08-10'), lot: 'LOT-2025-004', manufacturer: 'Merial' },
    ],
  })
  console.log(`  ✓ ${vaccines.count} vacinas criadas`)

  // ── ANTIPARASITÁRIOS (registrados pelo tutor) ─────────────
  console.log('\n🪱 Registrando antiparasitários (pelo tutor)...')

  const parasites = await prisma.antiParasite.createMany({
    data: [
      { petId: bolinha.id, tutorId: tutor.id, medicationName: 'Nexgard',        brand: 'Boehringer', appliedAt: new Date('2026-01-05'), expiresAt: new Date('2026-04-05'), notes: 'Aplicado após banho' },
      { petId: bolinha.id, tutorId: tutor.id, medicationName: 'Bravecto',        brand: 'MSD',        appliedAt: new Date('2025-10-01'), expiresAt: new Date('2026-01-01'), notes: 'Aplicação anterior — vencido' },
      { petId: mimi.id,    tutorId: tutor.id, medicationName: 'Revolution Plus', brand: 'Zoetis',     appliedAt: new Date('2026-02-10'), expiresAt: new Date('2026-05-10') },
    ],
  })
  console.log(`  ✓ ${parasites.count} registros criados`)

  // ── CONSULTAS (registradas pelo veterinário) ──────────────
  console.log('\n🏥 Registrando consultas (pelo veterinário)...')

  const consults = await prisma.consult.createMany({
    data: [
      {
        petId: bolinha.id, vetId: vet.id,
        date: new Date('2025-11-15'), clinic: 'Clínica VetMax',
        reason: 'Check-up anual',
        diagnosis: 'Animal saudável, peso dentro do esperado',
        treatment: 'Vermifugação preventiva',
        notes: 'Recomendar redução de ração',
        attachments: [],
      },
      {
        petId: bolinha.id, vetId: vet.id,
        date: new Date('2026-02-20'), clinic: 'Clínica VetMax',
        reason: 'Coceira excessiva',
        diagnosis: 'Dermatite atópica leve',
        treatment: 'Apoquel 16mg por 15 dias, shampoo medicamentoso',
        notes: 'Retorno em 30 dias',
        attachments: [],
      },
      {
        petId: mimi.id, vetId: vet.id,
        date: new Date('2026-01-08'), clinic: 'Clínica VetMax',
        reason: 'Vômito frequente',
        diagnosis: 'Gastrite leve por mudança de ração',
        treatment: 'Omeprazol + ração gastrointestinal por 10 dias',
        notes: 'Introduzir nova ração gradualmente',
        attachments: [],
      },
    ],
  })
  console.log(`  ✓ ${consults.count} consultas criadas`)

  // ── EXAMES (registrados pelo veterinário) ─────────────────
  console.log('\n🔬 Registrando exames (pelo veterinário)...')

  const exams = await prisma.exam.createMany({
    data: [
      {
        petId: bolinha.id, vetId: vet.id,
        date: new Date('2025-11-15'), type: 'Hemograma completo', lab: 'LabVet SP',
        result: 'Eritrócitos 6.8 M/µL, Leucócitos 9.2 K/µL — dentro dos valores de referência',
        notes: 'Sem alterações significativas',
      },
      {
        petId: bolinha.id, vetId: vet.id,
        date: new Date('2026-02-20'), type: 'Raspado de pele', lab: 'DermVet',
        result: 'Ausência de parasitas. Indicativo de hipersensibilidade ambiental.',
        notes: 'Correlacionar com histórico de alergias',
      },
      {
        petId: mimi.id, vetId: vet.id,
        date: new Date('2026-01-08'), type: 'Ultrassonografia abdominal', lab: 'ImageVet',
        result: 'Estômago com conteúdo excessivo, discreta hiperperistalse. Demais órgãos sem alterações.',
        notes: 'Compatível com gastrite',
      },
    ],
  })
  console.log(`  ✓ ${exams.count} exames criados`)

  // ── ALERGIAS ─────────────────────────────────────────────
  console.log('\n⚠️  Registrando alergias...')

  const allergies = await prisma.allergy.createMany({
    data: [
      { petId: bolinha.id, registeredById: vet.id, name: 'Pólen',      severity: 'MEDIUM', notes: 'Piora na primavera, manifesta como dermatite' },
      { petId: bolinha.id, registeredById: vet.id, name: 'Frango',     severity: 'LOW',    notes: 'Leve intolerância digestiva em grandes quantidades' },
      { petId: mimi.id,    registeredById: vet.id, name: 'Penicilina', severity: 'HIGH',   notes: 'Reação alérgica severa confirmada em 2024' },
      { petId: mimi.id,    registeredById: vet.id, name: 'Látex',      severity: 'MEDIUM', notes: 'Evitar luvas de látex durante procedimentos' },
    ],
  })
  console.log(`  ✓ ${allergies.count} alergias registradas`)

  // ── ACESSO DA CLÍNICA ─────────────────────────────────────
  console.log('\n🏨 Simulando acessos da clínica...')

  // Clínica solicitou e tutor aprovou acesso ao Bolinha
  const req1 = await prisma.accessRequest.create({
    data: {
      clinicId: clinic.id,
      tutorId:  tutor.id,
      petId:    bolinha.id,
      status:   'APPROVED',
      resolvedAt: new Date(),
    },
  })
  await prisma.accessLog.create({
    data: { clinicId: clinic.id, petId: bolinha.id },
  })
  console.log(`  ✓ Bolinha: acesso APROVADO para PetHotel Feliz`)

  // Clínica solicitou acesso à Mimi — pendente (tutor ainda não respondeu)
  const req2 = await prisma.accessRequest.create({
    data: {
      clinicId: clinic.id,
      tutorId:  tutor.id,
      petId:    mimi.id,
      status:   'PENDING',
    },
  })
  console.log(`  ⏳ Mimi: acesso PENDENTE (aguardando aprovação do tutor)`)

  // ── RESUMO ───────────────────────────────────────────────
  console.log('\n' + '═'.repeat(55))
  console.log('✅ SEED COMPLETO!')
  console.log('═'.repeat(55))
  console.log()
  console.log('  👤 TUTOR   → ana@petcare.com    / 123456')
  console.log('  🩺 VET     → carlos@petcare.com / 123456')
  console.log('  🏨 CLINIC  → hotel@petcare.com  / 123456')
  console.log()
  console.log(`  🐕 Bolinha  id: ${bolinha.id}`)
  console.log(`  🐈 Mimi     id: ${mimi.id}`)
  console.log()
  console.log('  Relações criadas:')
  console.log('  • Vet registrou 5 vacinas, 3 consultas, 3 exames, 4 alergias')
  console.log('  • Tutor registrou 3 antiparasitários')
  console.log('  • Clínica tem acesso aprovado ao Bolinha')
  console.log('  • Clínica tem acesso pendente à Mimi')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
