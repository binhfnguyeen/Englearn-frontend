"use client";

import React from "react";
import styles from "@/app/(client)/(auth)/register/Register.module.css";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.leaves}>
        <div className={styles.set}>
          <div><img src="/template/leaf_01.png" /></div>
          <div><img src="/template/leaf_02.png" /></div>
          <div><img src="/template/leaf_03.png" /></div>
          <div><img src="/template/leaf_04.png" /></div>
          <div><img src="/template/leaf_01.png" /></div>
          <div><img src="/template/leaf_02.png" /></div>
          <div><img src="/template/leaf_03.png" /></div>
          <div><img src="/template/leaf_04.png" /></div>
        </div>
      </div>
      <img src="/template/bg.jpg" className={styles.bg} />
      <img src="/template/girl.png" className={styles.girl} />
      <img src="/template/trees.png" className={styles.trees} />

      <div className={styles.register}>
        {children}
      </div>
    </section>
  );
}
