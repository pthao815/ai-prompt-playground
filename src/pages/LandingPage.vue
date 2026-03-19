<template>
  <div>
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

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import SocialProofSection from '../components/SocialProofSection.vue'
import FaqSection from '../components/FaqSection.vue'
import FooterSection from '../components/FooterSection.vue'
</script>
