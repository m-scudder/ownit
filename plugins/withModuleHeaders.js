const { withPodfile } = require('@expo/config-plugins');

module.exports = function withFirebasePodFix(config) {
  return withPodfile(config, (config) => {
    let podfile = config.modResults.contents;

    // 🔹 Insert frameworks + modular headers after use_expo_modules!
    if (!podfile.includes('use_frameworks!')) {
      podfile = podfile.replace(
        /use_expo_modules!\n/,
        `use_expo_modules!\n\n  # Added by config plugin for Firebase\n  use_frameworks! :linkage => :dynamic\n  use_modular_headers!\n`
      );
    }

    // 🔹 Patch Firebase-related pods to modular headers
    const podsToPatch = [
      'FirebaseCore',
      'GoogleUtilities',
      'FirebaseCoreInternal',
      'FirebaseAuthInterop',
      'FirebaseAppCheckInterop',
      'FirebaseCoreExtension',
      'RecaptchaInterop'
    ];

    podsToPatch.forEach((pod) => {
      const regex = new RegExp(`pod ['"]${pod}['"].*`, 'g');
      if (!regex.test(podfile)) {
        podfile = podfile.replace(
          /end\s*$/,
          `  pod '${pod}', :modular_headers => true\nend`
        );
      } else {
        podfile = podfile.replace(
          regex,
          `pod '${pod}', :modular_headers => true`
        );
      }
    });

    config.modResults.contents = podfile;
    return config;
  });
};
