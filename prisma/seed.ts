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

  // Create day schedules
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  for (const day of days) {
    await prisma.daySchedule.create({
      data: {
        businessId: business.id,
        dayOfWeek: day,
        isOpen: day !== 'sunday',
        openTime: day === 'saturday' || day === 'sunday' ? '10:00' : '09:00',
        closeTime: day === 'saturday' || day === 'sunday' ? '16:00' : '17:00',
        peakHoursEnabled: day !== 'sunday' && day !== 'saturday',
      },
    });
  }

  // Create other related records (role, user, membership, etc.)
  const role = await prisma.role.create({
    data: {
      customer: true,
      employee: false,
      supervisor: false,
      admin: false,
    },
  });

  const user = await prisma.user.create({
    data: {
      businessId: business.id,
      userRoleId: role.id,
      username: 'john_doe2234',
      email: 'john.doe2234@example.com',
    },
  });

  const membership = await prisma.membership.create({
    data: {
      businessId: business.id,
      yearlyCost: 1000.0,
      monthlyCost: 100.0,
    },
  });

  const durationConfig = await prisma.durationConfig.create({
    data: {
      businessId: business.id,
      minDuration: 30.0,
      maxDuration: 180.0,
      interval: 15,
    },
  });

  const pricing = await prisma.pricing.create({
    data: {
      businessId: business.id,
      weekdayPrice: 50,
      weekendPrice: 75,
      membershipDiscount: 0.1,
      soloPricingDiscount: 0.05,
      peakHourPricingEnabled: true,
      peakHourStart: '09:00',
      peakHourEnd: '17:00',
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
