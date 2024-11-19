import Loading from "../../../components/Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCalendarDay,
  faTrash,
  faPaypal,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const cookie = Cookie();
const token = cookie.get("admin-token");
const tokenUser = cookie.get("user-token");
const configget = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};
const configgetUser = {
  headers: {
    Authorization: `Bearer ${tokenUser}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const configFile = {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
};
// في ملف library.js
export {
  Loading,
  FontAwesomeIcon,
  faPenToSquare,
  configget,
  faTrash,
  useState,
  useEffect,
  Link,
  axios,
  Cookie,
  useNavigate,
  useParams,
  configFile,
  configgetUser,
  faCalendarDay,
};
