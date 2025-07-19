import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors.jsx';

export default function EmailInviteModal({ visible, onClose, organization, onInviteSent }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');

  const handleSendInvite = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (organization.members.includes(email.trim())) {
      Alert.alert('Error', 'This user is already a member of the organization');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call to send invite
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with your email service
      // For now, we'll simulate the email sending
      console.log(`Sending invite to ${email} for organization ${organization.name}`);
      console.log(`Message: ${inviteMessage || 'You have been invited to join our organization on PlanUp!'}`);
      
      Alert.alert(
        'Invite Sent',
        `Invitation sent to ${email}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setEmail('');
              setInviteMessage('');
              onClose();
              if (onInviteSent) {
                onInviteSent(email);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send invite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClose = () => {
    setEmail('');
    setInviteMessage('');
    onClose();
  };

  const renderInviteTemplate = ({ item }) => (
    <TouchableOpacity
      style={[styles.templateCard, { backgroundColor: colors.white, borderColor: colors.border }]}
      onPress={() => setInviteMessage(item.message)}
    >
      <View style={styles.templateHeader}>
        <Ionicons name="mail" size={20} color={colors.coral} />
        <Text style={[styles.templateTitle, { color: colors.text }]}>{item.title}</Text>
      </View>
      <Text style={[styles.templateMessage, { color: colors.textSecondary }]}>{item.message}</Text>
    </TouchableOpacity>
  );

  const inviteTemplates = [
    {
      id: '1',
      title: 'General Invite',
      message: 'You have been invited to join our organization on PlanUp! We would love to have you as part of our team.'
    },
    {
      id: '2',
      title: 'Developer Invite',
      message: 'We\'re looking for talented developers to join our team. You\'ve been invited to collaborate on exciting projects!'
    },
    {
      id: '3',
      title: 'Project Specific',
      message: 'You\'ve been invited to join our organization to work on a specific project. Your expertise would be valuable to our team.'
    },
    {
      id: '4',
      title: 'Custom Message',
      message: ''
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Invite Team Member</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Organization Info */}
          <View style={[styles.orgInfoCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <View style={[styles.orgAvatar, { backgroundColor: colors.coral }]}>
              <Ionicons name="business" size={24} color="#fff" />
            </View>
            <View style={styles.orgInfo}>
              <Text style={[styles.orgName, { color: colors.text }]}>{organization?.name}</Text>
              <Text style={[styles.orgMembers, { color: colors.textSecondary }]}>
                {organization?.members?.length || 0} member{(organization?.members?.length || 0) !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.white, 
                borderColor: colors.border, 
                color: colors.text 
              }]}
              placeholder="Enter email address"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Message Templates */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Invite Message</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Choose a template or write your own message
            </Text>
            
            <FlatList
              data={inviteTemplates}
              renderItem={renderInviteTemplate}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templatesContainer}
            />

            <TextInput
              style={[styles.messageInput, { 
                backgroundColor: colors.white, 
                borderColor: colors.border, 
                color: colors.text 
              }]}
              placeholder="Write your custom message..."
              placeholderTextColor={colors.textSecondary}
              value={inviteMessage}
              onChangeText={setInviteMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Email Preview */}
          {email && (
            <View style={[styles.previewCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>Email Preview</Text>
              <View style={styles.previewContent}>
                <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>To:</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>{email}</Text>
              </View>
              <View style={styles.previewContent}>
                <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Subject:</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>
                  Invitation to join {organization?.name} on PlanUp
                </Text>
              </View>
              <View style={styles.previewContent}>
                <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Message:</Text>
                <Text style={[styles.previewValue, { color: colors.text }]}>
                  {inviteMessage || 'You have been invited to join our organization on PlanUp!'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={handleClose}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sendButton, { 
              backgroundColor: isLoading ? colors.textSecondary : colors.coral 
            }]}
            onPress={handleSendInvite}
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="mail" size={20} color="#fff" />
                <Text style={styles.sendButtonText}>Send Invite</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  orgInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  orgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orgMembers: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  templatesContainer: {
    paddingBottom: 12,
  },
  templateCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 200,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  templateMessage: {
    fontSize: 12,
    lineHeight: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewContent: {
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  previewValue: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 