export default interface DecodedToken {
  sub: string;
  useremail: string;
  userType: string;
  iat: number;
  exp: number;
}
