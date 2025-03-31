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
    bio: 'Exploradora de novos horizontes.',
    location: 'Rio de Janeiro, RJ - Brazil',
  },
  {
    name: 'Miguel Souza',
    email: 'miguel.souza@email.com',
    bio: 'Apaixonado por tecnologia e inovação.',
    location: 'São Paulo, SP - Brazil',
  },
  {
    name: 'Amanda Nunes',
    email: 'amanda.nunes@email.com',
    bio: 'Entusiasta de fotografia e viagens.',
    location: 'Curitiba, PR - Brazil',
  },
  {
    name: 'Lucas Oliveira',
    email: 'lucas.oliveira@email.com',
    bio: 'Desenvolvedor full stack e gamer.',
    location: 'Belo Horizonte, MG - Brazil',
  },
  {
    name: 'Fernanda Castro',
    email: 'fernanda.castro@email.com',
    bio: 'Viciada em café e livros.',
    location: 'Brasília, DF - Brazil',
  },
  {
    name: 'Bruno Lima',
    email: 'bruno.lima@email.com',
    bio: 'Apreciador de música e boas conversas.',
    location: 'Salvador, BA - Brazil',
  },
  {
    name: 'Tatiane Ramos',
    email: 'tatiane.ramos@email.com',
    bio: 'Apaixonada por arte e criatividade.',
    location: 'Porto Alegre, RS - Brazil',
  },
  {
    name: 'Gabriel Santos',
    email: 'gabriel.santos@email.com',
    bio: 'Atleta e motivador nato.',
    location: 'Recife, PE - Brazil',
  },
  {
    name: 'Juliana Alves',
    email: 'juliana.alves@email.com',
    bio: 'Chef de cozinha em formação.',
    location: 'Fortaleza, CE - Brazil',
  },
  {
    name: 'Ricardo Mendes',
    email: 'ricardo.mendes@email.com',
    bio: 'Fã de ficção científica e programação.',
    location: 'Manaus, AM - Brazil',
  },
  {
    name: 'Priscila Rocha',
    email: 'priscila.rocha@email.com',
    bio: 'Amante de animais e natureza.',
    location: 'Florianópolis, SC - Brazil',
  },
  {
    name: 'Felipe Araújo',
    email: 'felipe.araujo@email.com',
    bio: 'Empreendedor e inovador.',
    location: 'Goiânia, GO - Brazil',
  },
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
  'Primeiro dia no novo projeto! Vai vir coisa boa por aí.',
  'Explorando novas tecnologias e aprendendo muito.',
  'Nada como um café forte para começar o dia.',
  'A vida é feita de desafios, e eu adoro superá-los!',
  'Música boa, um livro e um dia tranquilo.',
  'Desenvolvendo uma nova aplicação! Breve novidades.',
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

  // creates regular users
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
        userType: 'REGULAR',
        accountStatus: 'ACTIVE',
      });

      return userRepo.save(newUser);
    }),
  );
  console.log("Regular mock accounts created!");

  // adds random posts to mock users
  console.log("Adding random posts to regular mock accounts...");
  for (let i = 0; i < createdUsers.length / 2; i++) {
    const post = postRepo.create({
      content: posts[i % posts.length],
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
