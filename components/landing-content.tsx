"use client";
import Image from "next/image";
import {
  Book,
  Captions,
  Code,
  Eraser,
  ImageIcon,
  Languages,
  MessageSquare,
  Pickaxe,
  Sparkles,
  Video,
} from "lucide-react";
import { LandingFeatures } from "./landing-features";

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <div>
        <LandingFeatures />
      </div>

      {/* <div>
        <h2 className="text-left text-4xl text-black font-bold font-title mb-10">
          FAQ
        </h2>
        <div>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis nostrum
          blanditiis minus! Veniam, adipisci! Similique neque eligendi autem
          quaerat impedit explicabo soluta dolorem delectus dignissimos, ipsam
          repellat eaque voluptatibus deleniti modi doloribus molestias animi
          esse nisi odit error. Velit, sed. Voluptatem eveniet atque modi, id
          nostrum assumenda nam ut possimus magni veritatis, asperiores quaerat
          quam quis maxime aspernatur enim tempora nulla vel veniam esse quos
          officia adipisci? Commodi, unde ipsum nulla fugit deserunt ducimus
          culpa veniam magni, quos, ab velit facilis? Tempore laboriosam laborum
          fugit. Sint corporis perspiciatis nostrum veniam ab dolores at,
          temporibus a accusamus dolorem atque omnis facere ipsum voluptatem
          voluptas eveniet commodi tempore sequi voluptate. Molestias non, culpa
          mollitia sunt eligendi ipsum obcaecati animi voluptas veniam tempora
          voluptatem eius quis velit aut voluptates odio fugit aperiam magnam
          incidunt quia vitae quas reprehenderit facere? Officiis, corporis
          laudantium ab excepturi facilis vitae ipsam similique dicta? Expedita
          in esse exercitationem! Beatae, dignissimos molestias provident
          obcaecati esse ipsam aut! Minus eligendi officia ducimus doloremque
          excepturi consectetur reiciendis, iure magni soluta explicabo id
          aliquid magnam quae vitae molestias voluptatibus! Inventore, ut odit
          delectus quas nihil soluta dolores placeat in incidunt porro modi
          eligendi similique iure sunt illum voluptas fugit id consequatur quos?
        </div>
      </div> */}
    </div>
  );
};
