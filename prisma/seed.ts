const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a single business
  const business = await prisma.business.create({
    data: {
      name: 'Sample Business',
      location: 'New York',
      description: 'This is a sample business',
    },
  });

  // Create a single role
  const role = await prisma.role.create({
    data: {
      customer: true,
      employee: false,
      supervisor: false,
      admin: false,
    },
  });

  // Create a single user
  const user = await prisma.user.create({
    data: {
      businessId: business.id,
      userRoleId: role.id,
      username: 'john_doe2234',
      email: 'john.doe2234@example.com',
    },
  });

  // Create a single weekly schedule
  const weeklySchedule = await prisma.weeklySchedule.create({
    data: {
      weekdayOpen: '09:00',
      weekdayClose: '17:00',
      weekendOpen: '10:00',
      weekendClose: '16:00',
      daysClosed: ['Sunday'],
    },
  });

  // Create a single schedule
  const schedule = await prisma.schedule.create({
    data: {
      businessId: business.id,
      weeklyScheduleId: weeklySchedule.id,
    },
  });

  // Create a single membership
  const membership = await prisma.membership.create({
    data: {
      businessId: business.id,
      yearlyCost: 1000.0,
      monthlyCost: 100.0,
    },
  });

  // Create a single duration config
  const durationConfig = await prisma.durationConfig.create({
    data: {
      businessId: business.id,
      minDuration: 30.0,
      maxDuration: 180.0,
      interval: 15,
    },
  });

  // Create a single pricing
  const pricing = await prisma.pricing.create({
    data: {
      businessId: business.id,
      weekdayPrice: 50,
      weekendPrice: 75,
      membershipDiscount: 0.1,
      soloPricingDiscount: 0.05,
      peakHourPricingEnabled: true,
      peakHourPriceAdditionalCost: 10,
    },
  });

  console.log('Test data generated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });