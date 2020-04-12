import { Request, Response } from "express";
import jwt = require('jsonwebtoken');
import { Node } from "../model/Node";

let SECRET: string = process.env['SECRET'];

interface TokenData {
  uuid: string;
  name: string;
}

export function checkToken(req: Request, res: Response, next) {
  let authorization_header: string = req.headers['x-access-token'] as string || req.headers['authorization'] as string;

  if (authorization_header && authorization_header.startsWith('Bearer ')) {
    let token: string = authorization_header.slice(7, authorization_header.length);
    
    jwt.verify(token, SECRET, (err, decoded_node: TokenData) => {
      if (err || decoded_node.uuid as string != (req.body['uuid'])) { // Verify that's there's no error and that the token match the node
        res.status(403).send({
          message: 'Token is not valid'
        });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({
      message: 'Auth token is not supplied'
    });
  }
};

export function generateToken(node: Node): string {
  return jwt.sign({ uuid: node.uuid, name: node.name } as TokenData, SECRET, {expiresIn: '1y' /** 1 year */});
}