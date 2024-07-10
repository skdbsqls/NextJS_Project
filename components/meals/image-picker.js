"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import classes from "./image-picker.module.css";

export default function ImagePicker({ label, name }) {
  // 선택된 이미지를 관리하는 state
  const [pickedImage, setPickImage] = useState();

  // useRef 훅을 사용하여 ref를 생성하고
  const imageInput = useRef();

  // 숨겨진 input 클릭을 다루는 함수
  function handlePickClick() {
    // ref를 사용하여 click() 메서드 작동
    imageInput.current.click();
  }

  // 이미지 선택을 다루는 함수: input에 이벤트 변화가 있을 때 사용
  function handleImageChange(event) {
    const file = event.target.files[0]; // 한 개의 파일만 선택

    // 파일을 선택하지 않았을 때
    if (!file) {
      setPickImage(null);
      return;
    }

    // DataURL 생성하기
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      {/* label을 props로 받아와 출력, htmlFor 속성을 추가하고 props로 name을 받아와 input id에 연결 */}
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage} // 선택된 이미지 URL로 연결
              alt="The image selected by the user."
              fill
            />
          )}
        </div>
        <input
          className={classes.input} // hidden 속성으로 input을 가려줌
          type="file"
          id={name} // input id를 name으로 설정해 label과 연결
          accept="image/png, image/jpeg"
          name={name} // name: 업로드된 이미지를 추출하는데 필요
          ref={imageInput} // ref 속성값으로 사용해 연결
          onChange={handleImageChange}
          required
        />
        {/* button은 숨겨져있는 input을 클릭해야함 */}
        <button
          className={classes.button}
          type="button" // type을 설정하지 않으면 근처 form 자체를 제출함
          onClick={handlePickClick}
        >
          Pick on Image
        </button>
      </div>
    </div>
  );
}
