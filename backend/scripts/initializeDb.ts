import { config } from 'dotenv';
import { AuthenticationUsers } from '../src/scopes/authenticationUser/entities/authenticationUser.entity';
import { Post } from '../src/scopes/post/entities/post.entity';
import { Follow } from '../src/scopes/follow/entities/follow.entity';
import { dataSource } from '../src/infrastructure/data-source';
import * as bcrypt from 'bcrypt';

config();

const avatars = Array.from(
  { length: 6 },
  (_, i) => `${process.env.AVATAR_BASE_URL}avatar${i + 1}.jpg`,
);

const users = [
  {
    name: 'Carla Dias',
    email: 'carla.dias@email.com',
    bio: 'Exploradora de novos horizontes.',
    location: 'Rio de Janeiro, RJ - Brasil',
  },
  {
    name: 'Miguel Souza',
    email: 'miguel.souza@email.com',
    bio: 'Apaixonado por tecnologia e inovação.',
    location: 'São Paulo, SP - Brasil',
  },
  {
    name: 'Amanda Nunes',
    email: 'amanda.nunes@email.com',
    bio: 'Entusiasta de fotografia e viagens.',
    location: 'Curitiba, PR - Brasil',
  },
  {
    name: 'Lucas Oliveira',
    email: 'lucas.oliveira@email.com',
    bio: 'Desenvolvedor full stack e gamer.',
    location: 'Belo Horizonte, MG - Brasil',
  },
  {
    name: 'Fernanda Castro',
    email: 'fernanda.castro@email.com',
    bio: 'Viciada em café e livros.',
    location: 'Brasília, DF - Brasil',
  },
  {
    name: 'Bruno Lima',
    email: 'bruno.lima@email.com',
    bio: 'Apreciador de música e boas conversas.',
    location: 'Salvador, BA - Brasil',
  },
  {
    name: 'Tatiane Ramos',
    email: 'tatiane.ramos@email.com',
    bio: 'Apaixonada por arte e criatividade.',
    location: 'Porto Alegre, RS - Brasil',
  },
  {
    name: 'Gabriel Santos',
    email: 'gabriel.santos@email.com',
    bio: 'Atleta e motivador nato.',
    location: 'Recife, PE - Brasil',
  },
  {
    name: 'Juliana Alves',
    email: 'juliana.alves@email.com',
    bio: 'Chef de cozinha em formação.',
    location: 'Fortaleza, CE - Brasil',
  },
  {
    name: 'Ricardo Mendes',
    email: 'ricardo.mendes@email.com',
    bio: 'Fã de ficção científica e programação.',
    location: 'Manaus, AM - Brasil',
  },
  {
    name: 'Priscila Rocha',
    email: 'priscila.rocha@email.com',
    bio: 'Amante de animais e natureza.',
    location: 'Florianópolis, SC - Brasil',
  },
  {
    name: 'Felipe Araújo',
    email: 'felipe.araujo@email.com',
    bio: 'Empreendedor e inovador.',
    location: 'Goiânia, GO - Brasil',
  },
];

const admin = {
  name: 'Alan Sobchacki',
  email: 'a.sobchack@email.com',
  bio: 'Software Engineer | Web Developer',
  location: 'Cabo Frio, RJ - Brasil',
};

const spectator = {
  name: 'Guest',
  email: 'guest@guest.com',
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

async function initializeDb() {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const userRepo = dataSource.getRepository(AuthenticationUsers);
  const postRepo = dataSource.getRepository(Post);
  const followRepo = dataSource.getRepository(Follow);

  // creates admin
  await (async () => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_ACC_PASSWORD,
      saltRounds,
    );

    const newUser = userRepo.create({
      ...admin,
      password: hashedPassword,
      profilePicture: `${process.env.AVATAR_BASE_URL}adminavatar.jpg`,
      userType: 'ADMIN',
      accountStatus: 'ACTIVE',
    });

    return userRepo.save(newUser);
  })();

  // creates spectator
  await (async () => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_ACC_PASSWORD,
      saltRounds,
    );

    const newUser = userRepo.create({
      ...spectator,
      password: hashedPassword,
      profilePicture: `${process.env.AVATAR_BASE_URL}spectatoravatar.jpg`,
      userType: 'SPECTATOR',
      accountStatus: 'ACTIVE',
    });

    return userRepo.save(newUser);
  })();

  // creates regular users
  const createdUsers = await Promise.all(
    users.map(async (user, index) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        process.env.REGULAR_ACC_PASSWORD,
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

  // adds random posts to regular users
  for (let i = 0; i < createdUsers.length / 2; i++) {
    const post = postRepo.create({
      content: posts[i % posts.length],
      author: createdUsers[i],
    });
    await postRepo.save(post);
  }

  // creates random following relationships between regular users
  for (let i = 0; i < createdUsers.length / 3; i++) {
    const follower = createdUsers[i];
    const following = createdUsers[createdUsers.length - i - 1];
    if (follower && following) {
      const follow = followRepo.create({ follower, following });
      await followRepo.save(follow);
    }
  }

  console.log('Database initialized successfully!');
}

initializeDb().catch((error) => console.error('Error initializing DB:', error));
