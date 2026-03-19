<template>
  <div class="min-h-screen bg-[#0d0d1a] text-gray-300 antialiased">

    <NavBar />

    <main>
      <HeroSection />

      <div id="features">
        <FeaturesSection />
      </div>

      <div id="social-proof">
        <SocialProofSection />
      </div>

      <div id="faq">
        <FaqSection />
      </div>
    </main>

    <FooterSection />

  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import FeaturesSection from './components/FeaturesSection.vue'
import SocialProofSection from './components/SocialProofSection.vue'
import FaqSection from './components/FaqSection.vue'
import FooterSection from './components/FooterSection.vue'
</script>
