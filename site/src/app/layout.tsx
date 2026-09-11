import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FAQ_ENTRIES } from "../faq";
import { SITE_URL, GITHUB_URL } from "../links";
import "./globals.css";

const title = "GeoHelper | Practica GeoGuessr en Steam";
const description = "Explora coordenadas, lugares y mapas en tus sesiones de práctica de GeoGuessr en Steam. Obtén GeoHelper y sus actualizaciones manuales por Discord.";
export const metadata: Metadata = {
 applicationName:"GeoHelper", title, description,
 metadataBase:new URL(SITE_URL), alternates:{canonical:"/"},
 openGraph:{type:"website",url:SITE_URL,title,description,siteName:"GeoHelper",locale:"es_CL",images:[{url:"/og-image.png",width:1200,height:630,alt:"GeoHelper: coordenadas y mapas para practicar GeoGuessr en Steam"}]},
 twitter:{card:"summary_large_image",title,description,images:["/og-image.png"]},
 icons:{icon:[{url:"/favicon.ico?v=2",sizes:"any"},{url:"/favicon-32x32.png?v=2",sizes:"32x32",type:"image/png"},{url:"/favicon-16x16.png?v=2",sizes:"16x16",type:"image/png"}],apple:[{url:"/apple-touch-icon.png?v=2",sizes:"180x180",type:"image/png"}]},
 manifest:"/site.webmanifest",robots:"index, follow",publisher:"Zerinho23",category:"software"
};
export const viewport: Viewport = {themeColor:"#09090b",colorScheme:"dark"};
export default function RootLayout({children}:{children:React.ReactNode}){
 const graph=[
 {"@type":"WebSite","@id":SITE_URL+"/#website",name:"GeoHelper",url:SITE_URL,inLanguage:"es",publisher:{"@type":"Person",name:"Zerinho23",url:GITHUB_URL}},
 {"@type":"FAQPage","@id":SITE_URL+"/#faq",mainEntity:FAQ_ENTRIES.map(entry=>({"@type":"Question",name:entry.q,acceptedAnswer:{"@type":"Answer",text:entry.a}}))}
 ];
 return <html lang="es"><head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@graph":graph}).replace(/</g,"\\u003c")}}/></head><body>{children}<Analytics/><SpeedInsights/></body></html>;
}
