import { config } from 'dotenv';
import { Post } from '../scopes/post/entities/post.entity';
import { Follow } from '../scopes/follow/entities/follow.entity';
import { dataSource } from '../infrastructure/data-source';
import { AuthenticationUsers } from '../scopes/authenticationUser/entities/authenticationUser.entity';
import * as bcrypt from 'bcrypt';

config();

const avatars = Array.from(
  { length: 6 },
  (_, i) => `${process.env.AVATAR_BASE_URL}avatar${i + 1}.jpg`,
);

const mockUsers = [
  {
    name: 'Carla Dias',
    email: 'carla.dias@email.com',
    userType: 'REGULAR',
    bio: 'Exploradora de novos horizontes.',
    location: 'São Paulo, SP - Brazil',
  },
  {
    name: 'Michael Johnson',
    email: 'michael.johnson@email.com',
    userType: 'REGULAR',
    bio: 'Passionate about technology and innovation.',
    location: 'New York, NY - USA',
  },
  {
    name: 'Anna Schneider',
    email: 'anna.schneider@email.com',
    userType: 'BOT',
    bio: 'Fotografin und Reisebegeisterte.',
    location: 'Berlin, Germany',
  },
  {
    name: 'Haruto Tanaka',
    email: 'haruto.tanaka@email.com',
    userType: 'REGULAR',
    bio: 'フルスタック開発者とゲーマー。',
    location: 'Tokyo, Japan',
  },
  {
    name: 'Emma Clarke',
    email: 'emma.clarke@email.com',
    userType: 'BOT',
    bio: 'Amante de café e livros.',
    location: 'Toronto, ON - Canada',
  },
  {
    name: 'Carlos Fernández',
    email: 'carlos.fernandez@email.com',
    userType: 'BOT',
    bio: 'Amante de música y buenas conversaciones.',
    location: 'Madrid, Spain',
  },
  {
    name: 'Liam Walker',
    email: 'liam.walker@email.com',
    userType: 'BOT',
    bio: 'Passionate about art and creativity.',
    location: 'London, UK',
  },
  {
    name: 'Gabriel Santos',
    email: 'gabriel.santos@email.com',
    userType: 'REGULAR',
    bio: 'Athlete and natural motivator.',
    location: 'Los Angeles, CA - USA',
  },
  {
    name: 'Ji-eun Park',
    email: 'jieun.park@email.com',
    userType: 'BOT',
    bio: '요리사가 되기 위해 공부 중입니다.',
    location: 'Seoul, South Korea',
  },
  {
    name: 'Richard Van der Merwe',
    email: 'richard.merwe@email.com',
    userType: 'BOT',
    bio: 'Wetenskapfiksie en programmering aanhanger.',
    location: 'Cape Town, South Africa',
  }
];

const admin = {
  name: 'Alan Sobchacki',
  email: `${process.env.ADMIN_EMAIL}`,
  bio: 'Software Engineer | Web Developer',
  location: 'Cabo Frio, RJ - Brazil',
};

const spectator = {
  name: 'Spectator',
  email: `${process.env.SPECTATOR_EMAIL}`,
  bio: 'Just watching',
  location: 'Somewhere',
};

const posts = [
  'life be lifein fr 🤷‍♂️',
  'Living la vida loca',
  'what is this lmao',
  'マンション・オブ・マッドネスは史上最高のボードゲームだ！',
  'idk why im writing this',
  'bro i need sum motivation asap 💯',
  'Just finished a coding session. Time for some well-deserved rest.',
  'bruh this app is cooking',
  'My day only starts after a good cup of coffee',
  'nice app man!'
];

const saltRounds = 10;

async function initializeDb() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const userRepo = dataSource.getRepository(AuthenticationUsers);
  const postRepo = dataSource.getRepository(Post);
  const followRepo = dataSource.getRepository(Follow);

  // creates admin
  console.log("Creating admin account...");
  await (async () => {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      saltRounds,
    );

    const newUser = userRepo.create({
      ...admin,
      password: hashedPassword,
      profilePicture: `${process.env.AVATAR_BASE_URL}adminavatar.jpg`,
      userType: 'ADMIN',
      accountStatus: 'ACTIVE',
    });

    console.log("Admin account created!");
    return userRepo.save(newUser);
  })();

  // creates spectator
  console.log("Creating spectator account...");
  await (async () => {
    const hashedPassword = await bcrypt.hash(
      process.env.SPECTATOR_PASSWORD,
      saltRounds,
    );

    const newUser = userRepo.create({
      ...spectator,
      password: hashedPassword,
      profilePicture: `${process.env.AVATAR_BASE_URL}spectatoravatar.jpg`,
      userType: 'SPECTATOR',
      accountStatus: 'ACTIVE',
    });

    console.log("Spectator account created!");
    return userRepo.save(newUser);
  })();

  // creates regular mock users
  console.log("Creating regular mock accounts...");
  const createdUsers = await Promise.all(
    mockUsers.map(async (user, index) => {
      const hashedPassword = await bcrypt.hash(
        process.env.REGULAR_PASSWORD,
        saltRounds,
      );

      const newUser = userRepo.create({
        ...user,
        password: hashedPassword,
        profilePicture: avatars[index % avatars.length],
        userType: user.userType as AuthenticationUsers['userType'],
        accountStatus: 'ACTIVE',
      });

      return userRepo.save(newUser);
    }),
  );
  console.log("Regular mock accounts created!");

  // adds random posts to mock users
  console.log("Adding random posts to regular mock accounts...");
  for (let i = 0; i < createdUsers.length; i++) {
    const post = postRepo.create({
      content: posts[i],
      author: createdUsers[i],
    });
  
    await postRepo.save(post);
  }
  console.log("Posts created!");

  // creates random following relationships between mock users
  console.log("Creating following relationships between mock accounts...");
  for (let i = 0; i < createdUsers.length / 3; i++) {
    const follower = createdUsers[i];
    const following = createdUsers[createdUsers.length - i - 1];
    if (follower && following) {
      const follow = followRepo.create({ follower, following });
      await followRepo.save(follow);
    }
  }

  const users = await userRepo.find();

  // find follow requests where the user is the 'following' and the status is 'PENDING'
  for (const user of users) {
    const followRequests = await followRepo.find({
      where: { following: user, status: 'PENDING' },
      relations: ['follower', 'following'],
    });

    for (const followRequest of followRequests) {
      followRequest.status = 'ACCEPTED';

      await followRepo.save(followRequest); 
    }
  }

  console.log('All follow requests have been processed!');
  console.log('Database initialized successfully!');
}

initializeDb().catch((error) => console.error('Error initializing DB:', error));
